import { cloudinary } from "../../config/cloudinary";
import streamifier from "streamifier";

interface UploadFileResponse {
  success: boolean;
  url?: string;
  error?: string;
}


export const uploadFile = async (file: Express.Multer.File, payload: { protocol: string; host?: string }): Promise<UploadFileResponse> => {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const protocol = payload.protocol;
    const host = payload.host;

    // public is already exposed
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("File missing"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "nixvidmusic",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
