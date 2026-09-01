import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/firebaseAdmin";
import { cloudinary } from "@/lib/cloudinary";
import type { GalleryItemType } from "@/types";

interface DeleteRequestBody {
  publicId: string;
  type: GalleryItemType;
}

// POST /api/gallery/delete — admin-only. Deletes the Cloudinary asset by its publicId; the
// caller (GalleryScreen) then deletes the corresponding Firestore doc itself, matching this
// app's existing convention of the client driving all Firestore writes directly.
export async function POST(request: Request) {
  const uid = await verifyAdminRequest(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId, type } = (await request.json()) as DeleteRequestBody;
  if (!publicId || !type) {
    return NextResponse.json({ error: "publicId and type are required" }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: type === "video" ? "video" : "image" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
