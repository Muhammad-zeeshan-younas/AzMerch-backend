import { Request } from "express";
import multer, { FileFilterCallback, Multer } from "multer";
import { v1 as uuidv1 } from "uuid";

const MIME_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload: Multer = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, "uploads/images");
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + "." + ext);
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const isValid: boolean = !!MIME_TYPE_MAP[file.mimetype];
    const error = new Error("Invalid mime type!");
    if (!isValid) {
      cb(error);
    } else {
      cb(null, isValid);
    }
  },
});

export default fileUpload;
