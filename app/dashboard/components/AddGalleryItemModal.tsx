"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import type { GalleryItem, GalleryItemType } from "@/types";

interface AddGalleryItemModalProps {
  show: boolean;
  user: User;
  onUploaded: (item: Omit<GalleryItem, "id">) => void;
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

// The raw File + upload-progress state stay local to this modal rather than being lifted to
// FoundationDashboard like other modals' fields — a File object doesn't cleanly serialize as a
// controlled string prop the way the rest of this app's lifted form state does.
const AddGalleryItemModal = ({ show, user, onUploaded, onCancel }: AddGalleryItemModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  if (!show) return null;

  const resetAndClose = () => {
    setFile(null);
    setCaption("");
    setProgress(0);
    setError("");
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const idToken = await user.getIdToken();
      const signRes = await fetch("/api/gallery/sign", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!signRes.ok) throw new Error("Failed to get upload authorization");
      const sign: CloudinarySignResponse = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
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
            setProgress(Math.round((event.loaded / event.total) * 100));
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

      const type: GalleryItemType = uploadResult.resource_type === "video" ? "video" : "image";

      onUploaded({
        type,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        caption: caption.trim() || undefined,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        createdAt: new Date().toISOString(),
        createdBy: user.email ?? "",
      });

      setFile(null);
      setCaption("");
      setProgress(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Media</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo or Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading... {progress}%</p>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={resetAndClose}
              disabled={uploading}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGalleryItemModal;
