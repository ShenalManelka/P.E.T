import multer from 'multer';
import path from 'path';

// Define where and how to save the image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Unique filename: Date + original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check if the uploaded file is an image
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB Limit
});