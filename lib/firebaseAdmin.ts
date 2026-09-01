// Server-only Firebase Admin SDK setup. Used exclusively to verify the admin's Firebase ID
// token on the two Gallery API routes that touch Cloudinary (app/api/gallery/sign,
// app/api/gallery/delete) — those routes hold a secret (the Cloudinary API secret) that
// Firestore's own security rules can't protect, unlike ordinary Firestore reads/writes, which
// this app already leaves to console-managed rules (see CLAUDE.md). This app has exactly one
// admin and no role system anywhere (matches /salsabilownerlogin's "logged in == admin" model),
// so any valid token from this Firebase project is sufficient — no extra role/claim check.
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const getAdminApp = (): App => {
  if (getApps().length) return getApps()[0];

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set — required to verify admin requests.");
  }

  const serviceAccount = JSON.parse(serviceAccountKey);
  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
};

// Returns the verified uid on success, or null if the request isn't from an authenticated admin.
export const verifyAdminRequest = async (request: Request): Promise<string | null> => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.slice("Bearer ".length);
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
};
