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