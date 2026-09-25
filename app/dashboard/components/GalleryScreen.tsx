"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, CheckSquare, ImagePlus, Tag, Trash2 } from "lucide-react";
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
import type { GalleryItem } from "@/types";
import AddGalleryItemModal from "./AddGalleryItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
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
  const [assignSlug, setAssignSlug] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const visibleItems =
    projectFilter === ALL_PROJECTS ? items : items.filter((item) => (item.projectSlug ?? "") === projectFilter);

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
    setAssignSlug(item.projectSlug ?? "");
  };

  // "" removes the field entirely (deleteField) rather than storing an empty string, so
  // general items stay shaped exactly like ones uploaded without a project.
  const handleAssignConfirm = async () => {
    if (!assignTarget) return;
    setIsAssigning(true);
    try {
      await updateDoc(doc(db, "gallery", assignTarget.id), {
        projectSlug: assignSlug ? assignSlug : deleteField(),
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
      failed.push(...deleteTargets.slice(failed.length));
      console.error("Failed to get ID token:", error);
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
            onChange={(e) => setProjectFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 w-full xs:w-auto"
          >
            <option value={ALL_PROJECTS}>All media ({items.length})</option>
            <option value="">General — no project</option>
            {GALLERY_PROJECT_OPTIONS.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </select>
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
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 group"
              >
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-only preview grid, not worth next/image here
                  <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" loading="lazy" />
                )}
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Delete item"
                  title="Delete item"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  onClick={() => openAssign(item)}
                  className="absolute top-1 left-1 bg-white/90 text-indigo-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Change project"
                  title="Change project"
                >
                  <Tag size={12} />
                </button>
                {item.projectSlug && (
                  <span
                    className="absolute top-1 left-7 right-7 bg-indigo-600/85 text-white text-[9px] xs:text-[10px] px-1.5 py-0.5 rounded truncate"
                    title={getGalleryProjectTitle(item.projectSlug) ?? item.projectSlug}
                  >
                    {getGalleryProjectTitle(item.projectSlug) ?? item.projectSlug}
                  </span>
                )}
                {item.caption && (
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] xs:text-[10px] px-1.5 py-0.5 truncate">
                    {item.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddGalleryItemModal
        show={showAddModal}
        user={user}
        defaultProjectSlug={projectFilter === ALL_PROJECTS ? "" : projectFilter}
        onUploaded={handleUploaded}
        onCancel={() => setShowAddModal(false)}
      />

      {assignTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Change Project</h3>
            <select
              value={assignSlug}
              onChange={(e) => setAssignSlug(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              disabled={isAssigning}
            >
              <option value="">General (main gallery only)</option>
              {GALLERY_PROJECT_OPTIONS.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.title}
                </option>
              ))}
            </select>
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
        show={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        description={
          isDeleting
            ? "Deleting..."
            : `Are you sure you want to delete this ${deleteTarget?.type ?? "item"}? This action cannot be undone.`
        }
      />
    </div>
  );
};

export default GalleryScreen;
