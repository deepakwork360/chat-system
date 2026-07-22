import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary using process.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const avatarCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "s1mple-chat/avatars",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      resource_type: "image",
    };
  },
});

export const messageCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isAudio = file.mimetype.startsWith("audio/") || file.originalname.endsWith(".webm");
    const isImage = file.mimetype.startsWith("image/");

    return {
      folder: "s1mple-chat/messages",
      resource_type: isAudio ? "video" : isImage ? "image" : "raw", // Cloudinary treats audio files as "video" or "raw"
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`,
    };
  },
});

export { cloudinary };
