import multer from "multer";
import { AppError } from "../utilits/AppError.js";

const option = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    }
  });
  console.log("name of file ",storage.filename);

  function fileFilter(req, file, cb) {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Only images and PDFs are allowed", 400), false);
    }
  }

  return multer({ storage, fileFilter });
};

export const uploadSingleFile = (fieldName, folderName) =>
  option(folderName).single(fieldName);

export const uploadMixfile = (arrayOfFields, folderName) =>
  option(folderName).fields(arrayOfFields);
