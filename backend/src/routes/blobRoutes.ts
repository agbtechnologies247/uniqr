import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { postgresClient } from "../domains/db/postgresClient.js";
import { sessionEngine } from "../domains/auth/sessionEngine.js";

export const blobRouter = Router();

const UPLOADS_ROOT = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_ROOT)) { fs.mkdirSync(UPLOADS_ROOT, { recursive: true }); }

const storage = multer.diskStorage({
  destination: (req: any, _file: any, cb: any) => {
    const userId = req.userId || "anonymous";
    const userDir = path.join(UPLOADS_ROOT, userId);
    if (!fs.existsSync(userDir)) { fs.mkdirSync(userDir, { recursive: true }); }
    cb(null, userDir);
  },
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = ["image/png","image/jpeg","image/jpg","image/gif","image/webp","image/svg+xml","application/pdf","image/tiff"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
});

const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.cookies?.uq_session || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
  const session = await sessionEngine.validateSessionToken(token);
  if (!session) return res.status(401).json({ error: "SESSION_EXPIRED" });
  req.userId = session.user.id;
  next();
};

blobRouter.get("/my", requireAuth, async (req: any, res: any) => {
  try {
    const blobs = await postgresClient.getUserBlobs(req.userId);
    res.json({ status: "SUCCESS", blobs, count: blobs.length });
  } catch (err: any) { res.status(500).json({ error: "LIST_FAILED", message: err.message }); }
});

blobRouter.get("/user/:userId", requireAuth, async (req: any, res: any) => {
  try {
    const sessionUser = await postgresClient.findUserById(req.userId);
    if (req.userId !== req.params.userId && sessionUser?.role !== "admin") {
      return res.status(403).json({ error: "FORBIDDEN" });
    }
    const blobs = await postgresClient.getUserBlobs(req.params.userId);
    res.json({ status: "SUCCESS", blobs, count: blobs.length });
  } catch (err: any) { res.status(500).json({ error: "LIST_FAILED", message: err.message }); }
});

blobRouter.post("/upload", requireAuth, (req: any, res: any) => {
  const userId = req.userId;
  upload.single("file")(req, res, async (uploadErr: any) => {
    if (uploadErr) return res.status(400).json({ error: "UPLOAD_ERROR", message: uploadErr.message });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "NO_FILE", message: "No file uploaded. Use field name \"file\"." });
    try {
      const baseUrl = process.env.APP_BASE_URL || "https://uniqr.agbtechnologies.in";
      const blobUrl = `${baseUrl}/uploads/${userId}/${file.filename}`;
      const blob = await postgresClient.addBlob(userId, {
        fileName: file.filename, mimeType: file.mimetype, size: file.size, url: blobUrl,
        linkedProductId: req.body.linkedProductId || undefined
      });
      console.log(`[BLOB UPLOAD] User ${userId} uploaded ${file.filename} (${(file.size/1024).toFixed(1)} KB)`);
      res.json({ status: "SUCCESS", message: "File uploaded successfully", blob });
    } catch (err: any) {
      try { fs.unlinkSync(file.path); } catch {}
      res.status(500).json({ error: "BLOB_SAVE_FAILED", message: err.message });
    }
  });
});

blobRouter.delete("/:blobId", requireAuth, async (req: any, res: any) => {
  try {
    const blobs = await postgresClient.getUserBlobs(req.userId);
    const blob = blobs.find((b: any) => b.id === req.params.blobId);
    if (!blob) return res.status(404).json({ error: "BLOB_NOT_FOUND" });
    const filePath = path.join(UPLOADS_ROOT, req.userId, blob.fileName);
    if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
    await postgresClient.deleteBlob(req.userId, req.params.blobId);
    res.json({ status: "SUCCESS", message: "File deleted", blobId: req.params.blobId });
  } catch (err: any) { res.status(500).json({ error: "DELETE_FAILED", message: err.message }); }
});
