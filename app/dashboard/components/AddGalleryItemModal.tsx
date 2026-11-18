"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { GalleryItem, GalleryItemType } from "@/types";
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl, parseYouTubeVideoId } from "@/lib/youtubeVideo";
import GalleryProjectChecklist from "./GalleryProjectChecklist";

type AddMode = "upload" | "youtube";

interface AddGalleryItemModalProps {
  show: boolean;
  user: User;
  // Pre-selected project slugs (empty = general, no project page).
  defaultProjectSlugs?: string[];
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

// Stable default so the open-modal effect below doesn't re-run on every parent render.
const NO_PROJECTS: string[] = [];

const MAX_IMAGE_BYTES = 1024 * 1024; // 1MB — images are compressed client-side to fit this before upload.

// Firestore's addDoc() throws on any field set to `undefined` (caption when empty,
// width/height/duration when the upload response omits them) — build the object with only
// the keys that actually have values instead of relying on `?? undefined`.
const buildItemPayload = (
  uploadResult: CloudinaryUploadResponse,
  caption: string,
  projectSlugs: string[],
  inMainGallery: boolean,
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
  if (projectSlugs.length > 0) item.projectSlugs = projectSlugs;
  if (!inMainGallery) item.hideFromMainGallery = true;
  if (uploadResult.width !== undefined) item.width = uploadResult.width;
  if (uploadResult.height !== undefined) item.height = uploadResult.height;
  if (uploadResult.duration !== undefined) item.duration = uploadResult.duration;
  return item;
};

// Same rule as above: only keys with values, since addDoc() rejects undefined fields.
const buildYouTubePayload = (
  youtubeId: string,
  caption: string,
  projectSlugs: string[],
  inMainGallery: boolean,
  user: User
): Omit<GalleryItem, "id"> => {
  const item: Omit<GalleryItem, "id"> = {
    type: "youtube",
    url: getYouTubeWatchUrl(youtubeId),
    youtubeId,
    createdAt: new Date().toISOString(),
    createdBy: user.email ?? "",
  };
  const trimmedCaption = caption.trim();
  if (trimmedCaption) item.caption = trimmedCaption;
  if (projectSlugs.length > 0) item.projectSlugs = projectSlugs;
  if (!inMainGallery) item.hideFromMainGallery = true;
  return item;
};

// One link per line; blank lines ignored, duplicates collapsed.
const parseYouTubeLines = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const ids: string[] = [];
  const invalid: string[] = [];
  for (const line of lines) {
    const id = parseYouTubeVideoId(line);
    if (!id) invalid.push(line);
    else if (!ids.includes(id)) ids.push(id);
  }
  return { ids, invalid };
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
const AddGalleryItemModal = ({
  show,
  user,
  defaultProjectSlugs = NO_PROJECTS,
  onUploaded,
  onCancel,
}: AddGalleryItemModalProps) => {
  const [mode, setMode] = useState<AddMode>("upload");
  const [youtubeText, setYoutubeText] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [caption, setCaption] = useState("");
  const [projectSlugs, setProjectSlugs] = useState<string[]>(defaultProjectSlugs);
  const [inMainGallery, setInMainGallery] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Follow the gallery screen's filter each time the modal opens, so uploading while viewing
  // one project's media tags new files with that project by default.
  useEffect(() => {
    if (show) {
      setProjectSlugs(defaultProjectSlugs);
      setInMainGallery(true);
    }
  }, [show, defaultProjectSlugs]);

  if (!show) return null;

  const resetAndClose = () => {
    setQueue([]);
    setCaption("");
    setYoutubeText("");
    setYoutubeError("");
    setMode("upload");
    onCancel();
  };

  const youtubeParsed = parseYouTubeLines(youtubeText);

  // No Cloudinary step for links: each one is just a Firestore doc, written in order so the
  // saved items keep the same relative createdAt order as the pasted lines.
  const handleYouTubeSubmit = async () => {
    if (youtubeParsed.invalid.length > 0) {
      setYoutubeError(`Not a YouTube video link: ${youtubeParsed.invalid.join(", ")}`);
      return;
    }
    if (youtubeParsed.ids.length === 0) return;

    setUploading(true);
    setYoutubeError("");
    const failed: string[] = [];
    for (const id of youtubeParsed.ids) {
      try {
        await onUploaded(buildYouTubePayload(id, caption, projectSlugs, inMainGallery, user));
      } catch (err) {
        console.error(`Failed to save YouTube video ${id}:`, err);
        failed.push(id);
      }
    }
    setUploading(false);

    if (failed.length > 0) {
      setYoutubeText(failed.map(getYouTubeWatchUrl).join("\n"));
      setYoutubeError(`Failed to save ${failed.length} link(s). They are left in the box — try again.`);
    } else {
      resetAndClose();
    }
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

    await onUploaded(buildItemPayload(uploadResult, caption, projectSlugs, inMainGallery, user));
    updateQueueItem(index, { status: "done", progress: 100 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "youtube") {
      await handleYouTubeSubmit();
      return;
    }
    if (queue.length === 0) return;

    setUploading(true);
    // Sequential, not parallel — keeps the per-file progress bar meaningful and avoids hammering
    // the signing endpoint / Cloudinary with a burst of simultaneous large uploads.
    let anyFailed = false;
    for (let i = 0; i < queue.length; i++) {
      try {
        await uploadOne(queue[i].file, i);
      } catch (err) {
        anyFailed = true;
        updateQueueItem(i, { status: "error", error: (err as Error).message });
      }
    }
    setUploading(false);

    // Calling onCancel() (a parent setState) from inside a setQueue updater would run during
    // render in some cases — React warns loudly about that — so decide with a local flag instead.
    if (anyFailed) {
      setQueue((prev) => prev.filter((q) => q.status === "error"));
    } else {
      setQueue([]);
      setCaption("");
      onCancel();
    }
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
          <div className="mb-4 grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg" role="tablist">
            {(
              [
                ["upload", "Upload files"],
                ["youtube", "YouTube links"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                disabled={uploading}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === value ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "upload" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo or Video (multiple allowed)</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Images over 1MB are automatically compressed before upload.
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="youtube-links" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube video links (one per line)
              </label>
              <textarea
                id="youtube-links"
                value={youtubeText}
                onChange={(e) => {
                  setYoutubeText(e.target.value);
                  setYoutubeError("");
                }}
                rows={4}
                placeholder={"https://www.youtube.com/watch?v=...\nhttps://youtu.be/..."}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                required
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Watch, youtu.be and Shorts links all work. The video plays from YouTube; nothing is uploaded.
              </p>
              {youtubeParsed.ids.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {youtubeParsed.ids.map((id) => (
                    // eslint-disable-next-line @next/next/no-img-element -- i.ytimg.com isn't in next.config's image allowlist; a plain preview is enough here
                    <img
                      key={id}
                      src={getYouTubeThumbnailUrl(id)}
                      alt=""
                      className="w-full aspect-video object-cover rounded-md bg-gray-100"
                    />
                  ))}
                </div>
              )}
              {youtubeError && <p className="text-xs text-red-600 mt-2">{youtubeError}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Show in (applied to all)</label>
            <GalleryProjectChecklist
              inMainGallery={inMainGallery}
              onMainGalleryChange={setInMainGallery}
              selected={projectSlugs}
              onChange={setProjectSlugs}
              disabled={uploading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional, applied to all)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                        className="bg-emerald-600 h-1.5 rounded-full transition-all"
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
              className="flex-1 bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
