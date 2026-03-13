import multer from "multer";
import fs from "node:fs";
import path from "node:path";
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/\s+/g, "-");
        cb(null, `${timestamp}-${safeName}`);
    },
});
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image uploads are allowed"));
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.js.map