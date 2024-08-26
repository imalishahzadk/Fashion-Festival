import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const tokens = new Map(); // Temporary in-memory storage

// Generate download link function
export function generateDownloadLink(filename) {
  const token = uuidv4(); // Generate a unique token
  const expires = Date.now() + 3600000; // 1 hour from now

  // Store token with expiry time
  tokens.set(token, { filename, expires });

  return `${
    process.env.SERVER_URL || "http://localhost:3101"
  }/api/v1/uploads/download/${filename}?token=${token}&expires=${expires}`;
}

// Validate token function
export function validateToken(token) {
  const data = tokens.get(token);
  if (data && Date.now() <= data.expires) {
    tokens.delete(token); // Remove token after use
    return data.filename;
  }
  return null;
}

