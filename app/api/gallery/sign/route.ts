import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/firebaseAdmin";
import { signUploadParams } from "@/lib/cloudinary";

// POST /api/gallery/sign — admin-only. Returns a signature for a direct-to-Cloudinary browser
// upload; never uploads the file itself (see lib/cloudinary.ts for why). Requires an
// Authorization: Bearer <Firebase ID token> header from the already-authenticated dashboard.
export async function POST(request: Request) {
  const uid = await verifyAdminRequest(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = signUploadParams({ folder: "gallery" });
  return NextResponse.json(params);
}
