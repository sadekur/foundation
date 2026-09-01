"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import type { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GalleryItem } from "@/types";
import AddGalleryItemModal from "./AddGalleryItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface GalleryScreenProps {
  user: User;
  onBack: () => void;
}

const GalleryScreen = ({ user, onBack }: GalleryScreenProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleUploaded = async (item: Omit<GalleryItem, "id">) => {
    await addDoc(collection(db, "gallery"), item);
    setShowAddModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ publicId: deleteTarget.publicId, type: deleteTarget.type }),
      });
      if (!res.ok) throw new Error("Failed to delete asset");
      await deleteDoc(doc(db, "gallery", deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      alert("Failed to delete item: " + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-6">
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

      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            No gallery items yet. Click &quot;Add Media&quot; to upload the first photo or video.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group"
              >
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-only preview grid, not worth next/image here
                  <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Delete item"
                  title="Delete item"
                >
                  <Trash2 size={14} />
                </button>
                {item.caption && (
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[11px] px-2 py-1 truncate">
                    {item.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddGalleryItemModal show={showAddModal} user={user} onUploaded={handleUploaded} onCancel={() => setShowAddModal(false)} />

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
