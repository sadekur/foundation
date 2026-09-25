"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CheckSquare, EyeOff, ImagePlus, Tag, Trash2 } from "lucide-react";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getGalleryItemProjectSlugs } from "@/lib/gallery";
import type { GalleryItem } from "@/types";
import AddGalleryItemModal from "./AddGalleryItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import GalleryProjectChecklist from "./GalleryProjectChecklist";
import { GALLERY_PROJECT_OPTIONS, getGalleryProjectTitle } from "./galleryProjectOptions";

// "all" shows everything, "" shows untagged (general) items, anything else is a project slug.
const ALL_PROJECTS = "all";

interface GalleryScreenProps {
  user: User;
  onBack: () => void;
}

const GalleryScreen = ({ user, onBack }: GalleryScreenProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  // One array for both the single trash button ([item]) and bulk delete (the selection).
  const [deleteTargets, setDeleteTargets] = useState<GalleryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [projectFilter, setProjectFilter] = useState(ALL_PROJECTS);
  const [assignTarget, setAssignTarget] = useState<GalleryItem | null>(null);
  const [assignSlugs, setAssignSlugs] = useState<string[]>([]);
  const [assignInMain, setAssignInMain] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const visibleItems =
    projectFilter === ALL_PROJECTS
      ? items
      : items.filter((item) => {
          const slugs = getGalleryItemProjectSlugs(item);
          return projectFilter === "" ? slugs.length === 0 : slugs.includes(projectFilter);
        });

  // Memoized so AddGalleryItemModal's open-time reset effect sees a stable array.
  const uploadDefaultSlugs = useMemo(
    () => (projectFilter === ALL_PROJECTS || projectFilter === "" ? [] : [projectFilter]),
    [projectFilter]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "gallery"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setItems(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as GalleryItem));
      },
      (error) => {
        console.error("Error listening to gallery collection:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Closing the modal is the modal's own job now that it can upload multiple files in one
  // queue (see AddGalleryItemModal) — closing it here after the first file's Firestore write
  // would hide the progress of every file after it.
  const handleUploaded = async (item: Omit<GalleryItem, "id">) => {
    await addDoc(collection(db, "gallery"), item);
  };

  const openAssign = (item: GalleryItem) => {
    setAssignTarget(item);
    setAssignSlugs(getGalleryItemProjectSlugs(item));
    setAssignInMain(!item.hideFromMainGallery);
  };

  // No projects removes the field entirely (deleteField) rather than storing an empty array, so
  // general items stay shaped exactly like ones uploaded without a project. Always deletes the
  // legacy projectSlug field too, converting old single-project items to the new shape.
  const handleAssignConfirm = async () => {
    if (!assignTarget) return;
    setIsAssigning(true);
    try {
      await updateDoc(doc(db, "gallery", assignTarget.id), {
        projectSlugs: assignSlugs.length > 0 ? assignSlugs : deleteField(),
        projectSlug: deleteField(),
        hideFromMainGallery: assignInMain ? deleteField() : true,
      });
      setAssignTarget(null);
    } catch (error) {
      alert("Failed to update project: " + (error as Error).message);
    } finally {
      setIsAssigning(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selectedIds.has(item.id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleItems.forEach((item) => next.delete(item.id));
      else visibleItems.forEach((item) => next.add(item.id));
      return next;
    });
  };

  const deleteOne = async (item: GalleryItem, idToken: string) => {
    const res = await fetch("/api/gallery/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ publicId: item.publicId, type: item.type }),
    });
    if (!res.ok) throw new Error("Failed to delete asset");
    await deleteDoc(doc(db, "gallery", item.id));
  };

  // Sequential rather than Promise.all so a large selection doesn't fire dozens of concurrent
  // Cloudinary destroys, and so the confirmation modal can show "n of total" progress. Items
  // that fail stay selected so the admin can retry just those.
  const handleDeleteConfirm = async () => {
    if (deleteTargets.length === 0 || isDeleting) return;
    setIsDeleting(true);
    setDeleteProgress(0);
    const failed: GalleryItem[] = [];
    try {
      const idToken = await user.getIdToken();
      for (const item of deleteTargets) {
        try {
          await deleteOne(item, idToken);
        } catch (error) {
          console.error(`Failed to delete gallery item ${item.id}:`, error);
          failed.push(item);
        }
        setDeleteProgress((n) => n + 1);
      }
    } catch (error) {
      // Only getIdToken can land here (per-item errors are caught inside the loop), so nothing was deleted.
      console.error("Failed to get ID token:", error);
      failed.push(...deleteTargets);
    } finally {
      setIsDeleting(false);
      setDeleteTargets([]);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        deleteTargets.forEach((item) => next.delete(item.id));
        failed.forEach((item) => next.add(item.id));
        return next;
      });
    }
    if (failed.length > 0) {
      alert(`Failed to delete ${failed.length} of ${deleteTargets.length} item(s). They are still selected — try again.`);
    } else if (selectMode) {
      exitSelectMode();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors
                          p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                          w-fit"
              >
                <ArrowLeft size={16} className="xs:w-5 xs:h-5" />
                <span className="text-sm xs:text-base">Back to Dashboard</span>
              </button>
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Gallery
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors w-fit"
            >
              <ImagePlus size={16} />
              Add Media
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="mb-4 flex flex-col xs:flex-row xs:items-center gap-2">
          <label htmlFor="gallery-project-filter" className="text-sm font-medium text-gray-700">
            Show:
          </label>
          <select
            id="gallery-project-filter"
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
              // Don't let "Delete selected" reach items the new filter hides.
              setSelectedIds(new Set());
            }}
            className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 w-full xs:w-auto"
          >
            <option value={ALL_PROJECTS}>All media ({items.length})</option>
            <option value="">General only — no project</option>
            {GALLERY_PROJECT_OPTIONS.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </select>
          {items.length > 0 &&
            (selectMode ? (
              <div className="flex flex-wrap items-center gap-2 xs:ml-auto">
                <span className="text-sm text-gray-700 font-medium">{selectedIds.size} selected</span>
                <button
                  onClick={toggleSelectAllVisible}
                  disabled={visibleItems.length === 0}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {allVisibleSelected ? "Deselect all" : "Select all"}
                </button>
                <button
                  onClick={() => setDeleteTargets(items.filter((item) => selectedIds.has(item.id)))}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Delete selected
                </button>
                <button
                  onClick={exitSelectMode}
                  className="px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectMode(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 w-fit xs:ml-auto"
              >
                <CheckSquare size={14} />
                Select
              </button>
            ))}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            No gallery items yet. Click &quot;Add Media&quot; to upload the first photo or video.
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            No media for this project yet. Click &quot;Add Media&quot; to upload some, or tag existing items with the
            tag button.
          </div>
        ) : (
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 xs:gap-3">
            {visibleItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
              <div
                key={item.id}
                onClick={selectMode ? () => toggleSelected(item.id) : undefined}
                className={`relative aspect-square rounded-md overflow-hidden bg-gray-100 border group ${
                  selectMode ? "cursor-pointer" : ""
                } ${isSelected ? "border-red-500 ring-2 ring-red-500" : "border-gray-200"}`}
              >
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-only preview grid, not worth next/image here
                  <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" loading="lazy" />
                )}
                {selectMode ? (
                  <>
                    {isSelected && <div className="absolute inset-0 bg-red-500/20 pointer-events-none" />}
                    <span
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label="Select item"
                      className={`absolute top-1 right-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? "bg-red-600 border-red-600 text-white" : "bg-white/90 border-gray-400"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setDeleteTargets([item])}
                      className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Delete item"
                      title="Delete item"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button
                      onClick={() => openAssign(item)}
                      className="absolute top-1 left-1 bg-white/90 text-indigo-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Change projects"
                      title="Change projects"
                    >
                      <Tag size={12} />
                    </button>
                  </>
                )}
                {(() => {
                  const titles = getGalleryItemProjectSlugs(item).map((slug) => getGalleryProjectTitle(slug) ?? slug);
                  if (titles.length === 0) return null;
                  return (
                    <span
                      className="absolute top-1 left-7 right-7 bg-indigo-600/85 text-white text-[9px] xs:text-[10px] px-1.5 py-0.5 rounded truncate"
                      title={titles.join(", ")}
                    >
                      {titles.length > 1 ? `${titles[0]} +${titles.length - 1}` : titles[0]}
                    </span>
                  );
                })()}
                {item.hideFromMainGallery && (
                  <span
                    className="absolute bottom-1 right-1 bg-gray-900/75 text-white p-1 rounded-full"
                    title="Hidden from the main gallery slider"
                  >
                    <EyeOff size={10} />
                  </span>
                )}
                {item.caption && (
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] xs:text-[10px] px-1.5 py-0.5 truncate">
                    {item.caption}
                  </span>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      <AddGalleryItemModal
        show={showAddModal}
        user={user}
        defaultProjectSlugs={uploadDefaultSlugs}
        onUploaded={handleUploaded}
        onCancel={() => setShowAddModal(false)}
      />

      {assignTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Change Projects</h3>
            <GalleryProjectChecklist
              inMainGallery={assignInMain}
              onMainGalleryChange={setAssignInMain}
              selected={assignSlugs}
              onChange={setAssignSlugs}
              disabled={isAssigning}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAssignConfirm}
                disabled={isAssigning}
                className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {isAssigning ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setAssignTarget(null)}
                disabled={isAssigning}
                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        show={deleteTargets.length > 0}
        onCancel={() => {
          if (!isDeleting) setDeleteTargets([]);
        }}
        onConfirm={handleDeleteConfirm}
        description={
          isDeleting
            ? deleteTargets.length > 1
              ? `Deleting ${Math.min(deleteProgress + 1, deleteTargets.length)} of ${deleteTargets.length}...`
              : "Deleting..."
            : deleteTargets.length > 1
              ? `Are you sure you want to delete these ${deleteTargets.length} items? This action cannot be undone.`
              : `Are you sure you want to delete this ${deleteTargets[0]?.type ?? "item"}? This action cannot be undone.`
        }
      />
    </div>
  );
};

export default GalleryScreen;
