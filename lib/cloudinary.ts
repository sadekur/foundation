// Server-only Cloudinary config for the Gallery upload/delete flow. Never import this from a
// Client Component — it needs the API secret. `cloudinary.config()` auto-parses
// process.env.CLOUDINARY_URL (the SDK's own combined "cloudinary://key:secret@cloud_name"
// format), so no manual field mapping is needed.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

export { cloudinary };

interface SignUploadParamsOptions {
  folder: string;
}

// Signs the params for a direct-to-Cloudinary browser upload (the browser POSTs the file
// straight to Cloudinary's endpoint with this signature — the file itself never passes
// through our server, avoiding Vercel serverless body/duration limits on large videos).
export const signUploadParams = ({ folder }: SignUploadParamsOptions) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret as string);

  return {
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key as string,
    cloudName: cloudinary.config().cloud_name as string,
    folder,
  };
};
