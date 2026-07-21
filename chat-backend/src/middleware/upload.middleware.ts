import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folders exist
const avatarsDir = path.join(__dirname, "../../uploads/avatars");
const messagesDir = path.join(__dirname, "../../uploads/messages");

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

// Storage for profile avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// Storage for chat attachments
const messageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, messagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // Keep original base name sanitized + unique suffix
    const originalNameClean = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${originalNameClean}-${uniqueSuffix}${ext}`);
  },
});

// Filter for images only
const imageFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Expose multer upload helpers
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: imageFilter,
});

export const uploadMessageFile = multer({
  storage: messageStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});
