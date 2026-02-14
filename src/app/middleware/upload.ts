import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from "uuid";


// // Configure multer for memory storage
// export const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//       fileSize: 5 * 1024 * 1024, // 5MB limit
//     },
//     fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
//       cb(null, true);
//     }
//   });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "uploads"));
  },
  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);
    // const baseName = path.basename(file.originalname, ext);
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const upload = multer({
  // storage: multer.memoryStorage(),
  storage,
  limits: {
    // fileSize: 250 * 1024 * 1024, // ২৫০MB = 250 * 1024 * 1024 bytes
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },

  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    cb(null, true);
  }
});
