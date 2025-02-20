const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Rename file with timestamp to avoid name conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter to Allow Specific File Types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|jpg|jpeg|png|xlsx/; // Allowed extensions
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Correct MIME type for .xlsx
  ];

  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only PDF, JPG, JPEG, PNG, and XLSX files are allowed!'));
  }
};

// Multer Upload Middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter,
});

module.exports = upload;