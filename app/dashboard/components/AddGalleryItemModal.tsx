"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import type { GalleryItem, GalleryItemType } from "@/types";

interface AddGalleryItemModalProps {
  show: boolean;
  user: User;
  onUploaded: (item: Omit<GalleryItem, "id">) => Promise<void>;
  onCancel: () => void;
}

interface CloudinarySignResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

const MAX_IMAGE_BYTES = 1024 * 1024; // 1MB — images are compressed client-side to fit this before upload.

// Firestore's addDoc() throws on any field set to `undefined` (caption when empty,
// width/height/duration when the upload response omits them) — build the object with only
// the keys that actually have values instead of relying on `?? undefined`.
const buildItemPayload = (
  uploadResult: CloudinaryUploadResponse,
  caption: string,
  user: User
): Omit<GalleryItem, "id"> => {
  const type: GalleryItemType = uploadResult.resource_type === "video" ? "video" : "image";
  const item: Omit<GalleryItem, "id"> = {
    type,
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    bytes: uploadResult.bytes,
    format: uploadResult.format,
    createdAt: new Date().toISOString(),
    createdBy: user.email ?? "",
  };
  const trimmedCaption = caption.trim();
  if (trimmedCaption) item.caption = trimmedCaption;
  if (uploadResult.width !== undefined) item.width = uploadResult.width;
  if (uploadResult.height !== undefined) item.height = uploadResult.height;
  if (uploadResult.duration !== undefined) item.duration = uploadResult.duration;
  return item;
};

// Re-encodes an oversized image as JPEG, stepping quality down and then dimensions down, until
// it fits under maxBytes (or gives up after a fixed number of attempts and returns the last
// result). Videos are left untouched — client-side video compression needs a much heavier tool
// than a <canvas>, and is out of scope here.
const compressImage = async (file: File, maxBytes = MAX_IMAGE_BYTES): Promise<File> => {
  if (!file.type.startsWith("image/") || file.size <= maxBytes) return file;

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  let quality = 0.9;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.drawImage(bitmap, 0, 0, width, height);
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= maxBytes) break;
    if (quality > 0.5) {
      quality -= 0.15;
    } else {
      width = Math.round(width * 0.75);
      height = Math.round(height * 0.75);
    }
  }

  bitmap.close();
  if (!blob) return file;
  const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
};

interface QueueItem {
  file: File;
  status: "pending" | "compressing" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

// The raw File + upload-progress state stay local to this modal rather than being lifted to
// FoundationDashboard like other modals' fields — File objects don't cleanly serialize as
// controlled string props the way the rest of this app's lifted form state does.
const AddGalleryItemModal = ({ show, user, onUploaded, onCancel }: AddGalleryItemModalProps) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const resetAndClose = () => {
    setQueue([]);
    setCaption("");
    onCancel();
  };

  const updateQueueItem = (index: number, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const uploadOne = async (file: File, index: number) => {
    updateQueueItem(index, { status: "compressing" });
    const uploadFile = await compressImage(file);

    updateQueueItem(index, { status: "uploading", progress: 0 });
    const idToken = await user.getIdToken();
    const signRes = await fetch("/api/gallery/sign", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!signRes.ok) throw new Error("Failed to get upload authorization");
    const sign: CloudinarySignResponse = await signRes.json();

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("api_key", sign.apiKey);
    formData.append("timestamp", String(sign.timestamp));
    formData.append("signature", sign.signature);
    formData.append("folder", sign.folder);

    // XMLHttpRequest, not fetch, so xhr.upload.onprogress can drive the progress bar for
    // large video uploads — fetch has no upload-progress event.
    const uploadResult = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          updateQueueItem(index, { progress: Math.round((event.loaded / event.total) * 100) });
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Cloudinary upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Cloudinary upload failed"));
      xhr.send(formData);
    });

    await onUploaded(buildItemPayload(uploadResult, caption, user));
    updateQueueItem(index, { status: "done", progress: 100 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queue.length === 0) return;

    setUploading(true);
    // Sequential, not parallel — keeps the per-file progress bar meaningful and avoids hammering
    // the signing endpoint / Cloudinary with a burst of simultaneous large uploads.
    for (let i = 0; i < queue.length; i++) {
      try {
        await uploadOne(queue[i].file, i);
      } catch (err) {
        updateQueueItem(i, { status: "error", error: (err as Error).message });
      }
    }
    setUploading(false);

    setQueue((prev) => {
      const stillFailed = prev.filter((q) => q.status === "error");
      if (stillFailed.length === 0) {
        setCaption("");
        onCancel();
        return [];
      }
      return stillFailed;
    });
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    setQueue(Array.from(fileList).map((file) => ({ file, status: "pending", progress: 0 })));
  };

  const removeQueued = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Media</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo or Video (multiple allowed)</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Images over 1MB are automatically compressed before upload.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional, applied to all)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={uploading}
            />
          </div>

          {queue.length > 0 && (
            <div className="mb-4 space-y-2">
              {queue.map((q, i) => (
                <div key={`${q.file.name}-${i}`} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate flex-1 mr-2">{q.file.name}</span>
                    {!uploading && q.status === "pending" && (
                      <button type="button" onClick={() => removeQueued(i)} className="text-gray-400 hover:text-red-600">
                        Remove
                      </button>
                    )}
                    {q.status === "compressing" && <span className="text-gray-500">Compressing…</span>}
                    {q.status === "done" && <span className="text-green-600">Done</span>}
                    {q.status === "error" && <span className="text-red-600">{q.error}</span>}
                  </div>
                  {(q.status === "uploading" || q.status === "done") && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${q.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={queue.length === 0 || uploading}
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading…" : queue.length > 1 ? `Upload ${queue.length} files` : "Upload"}
            </button>
            <button
              type="button"
              onClick={resetAndClose}
              disabled={uploading}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-60"
            >
              {queue.some((q) => q.status === "done") ? "Close" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGalleryItemModal;
