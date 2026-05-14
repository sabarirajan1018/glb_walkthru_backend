const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for GLB file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/models');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.glb', '.gltf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb and .gltf files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB limit

// GET /api/models — list all uploaded models
router.get('/', (req, res) => {
  const modelsDir = path.join(__dirname, '../public/models');
  if (!fs.existsSync(modelsDir)) return res.json({ models: [] });

  const files = fs.readdirSync(modelsDir).filter((f) => /\.(glb|gltf)$/i.test(f));
  const models = files.map((f) => ({
    name: f,
    url: `/models/${f}`,
    size: fs.statSync(path.join(modelsDir, f)).size,
  }));

  res.json({ models });
});

// POST /api/models/upload — upload a GLB file
router.post('/upload', upload.single('model'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    message: 'Model uploaded successfully',
    filename: req.file.filename,
    url: `/models/${req.file.filename}`,
    size: req.file.size,
  });
});

// DELETE /api/models/:filename
router.delete('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/models', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  fs.unlinkSync(filePath);
  res.json({ message: 'Model deleted' });
});

module.exports = router;
