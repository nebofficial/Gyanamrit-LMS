import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { config } from "../config/config";

/**
 * Upload files to Cloudinary, optionally overwriting by public_id.
 * @param files - Multer file array
 * @param publicIds - Optional array of public_ids to overwrite
 * @returns Array of Cloudinary UploadApiResponse
 */
const uploadFile = (
  files?: Express.Multer.File[],
  publicIds?: string[]
): Promise<UploadApiResponse[]> => {
  if (!files || files.length === 0) {
    console.warn("⚠️ No files provided for upload.");
    return Promise.resolve([]);
  }

  return Promise.all(
    files.map(
      (file, index) =>
        new Promise<UploadApiResponse>((resolve, reject) => {
          const public_id = publicIds?.[index];

          console.log(
            `📤 Uploading file: ${file.originalname} (${
              file.mimetype
            }), Buffer length: ${file.buffer?.length}, ${
              public_id ? `Replacing: ${public_id}` : "New upload"
            }`
          );

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: config.cloudinaryFolder,
              public_id, // will overwrite if provided
              overwrite: true, // needed for replacing
            },
            (error, result) => {
              if (error || !result) {
                console.error(
                  "❌ Upload error:",
                  error || "No result from Cloudinary"
                );
                return reject(error || new Error("Failed to upload file"));
              }

              console.log("✅ Upload successful:", {
                public_id: result.public_id,
                secure_url: result.secure_url,
              });

              resolve(result);
            }
          );

          // Write file buffer to the stream
          uploadStream.end(file.buffer);
        })
    )
  );
};

export default uploadFile;
