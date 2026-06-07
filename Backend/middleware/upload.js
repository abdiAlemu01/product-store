import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// ── Startup credential check ─────────────────────────────────────────────────
const missingVars = [];
if (!CLOUD_NAME || CLOUD_NAME === "your_cloud_name") missingVars.push("CLOUDINARY_CLOUD_NAME");
if (!API_KEY   || API_KEY   === "your_api_key")   missingVars.push("CLOUDINARY_API_KEY");
if (!API_SECRET|| API_SECRET=== "your_api_secret")missingVars.push("CLOUDINARY_API_SECRET");

if (missingVars.length > 0) {
  console.error("─────────────────────────────────────────────────────────");
  console.error("❌  CLOUDINARY NOT CONFIGURED — image uploads will fail!");
  console.error("   Missing / placeholder values in Backend/.env:");
  missingVars.forEach((v) => console.error(`     • ${v}`));
  console.error("");
  console.error("   Steps:");
  console.error("   1. Go to https://cloudinary.com and sign up (free)");
  console.error("   2. Open your Dashboard and copy Cloud Name, API Key, API Secret");
  console.error("   3. Paste the real values into Backend/.env");
  console.error("   4. Restart the server");
  console.error("─────────────────────────────────────────────────────────");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Store images in Cloudinary under the "products" folder
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

// File filter — accept only image MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  if (allowedTypes.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed!"));
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter,
});

export default upload;
