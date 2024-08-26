import express from "express";
import multer from "multer";
import path from "path";

import { AppError } from "../utilits/AppError.js";
import Joi from "joi";
import { validation } from "./validation.js";
import {
  generateDownloadLink,
  validateToken,
} from "../middleware/generateDownloadLink.js"; 

// Set up multer storage options
const option = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix + "-" + file.originalname;
      cb(null, fileName);
    },
  });

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

// Initialize multer upload functions
const uploadSingleFile = (fieldName, folderName) =>
  option(folderName).single(fieldName);

const uploadMixfile = (arrayOfFields, folderName) =>
  option(folderName).fields(arrayOfFields);

const router = express.Router();

// Route for single file upload
router.post(
  "/upload-single",
  uploadSingleFile("file", ""), // Upload to 'uploads' folder
  (req, res) => {
    res.send("File uploaded successfully");
  }
);

// Route for multiple file uploads
router.post(
  "/upload-multiple",
  uploadMixfile(
    [
      { name: "images", maxCount: 5 },
      { name: "pdfs", maxCount: 3 },
    ],
    "" // Upload to 'uploads' folder
  ),
  (req, res) => {
    res.send("Files uploaded successfully");
  }
);


// Route to handle file download
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const { token, expires } = req.query;

  if (!expires || !token) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const validFilename = validateToken(token);
  if (!validFilename) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // File path where the uploaded file is stored
  const filePath = path.join('uploads', validFilename);

  // Send the file to the user
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ err: 'File not found', statusCode: 404 });
    }
  });
});

// Route to generate download link
router.get('/generate-link/:filename', (req, res) => {
  const { filename } = req.params;
  const downloadLink = generateDownloadLink(filename);
  res.json({ link: downloadLink });
});

export default router;
