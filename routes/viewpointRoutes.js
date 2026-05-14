const express = require('express');
const Viewpoint = require('../models/Viewpoint');

const router = express.Router();

// GET all viewpoints
router.get('/', async (req, res) => {
  try {
    const viewpoints = await Viewpoint.find().sort({ createdAt: -1 });
    res.json({ viewpoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create viewpoint
router.post('/', async (req, res) => {
  try {
    const { name, description, position, rotation, modelId } = req.body;
    const viewpoint = new Viewpoint({ name, description, position, rotation, modelId });
    await viewpoint.save();
    res.status(201).json({ message: 'Viewpoint saved', viewpoint });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update viewpoint
router.put('/:id', async (req, res) => {
  try {
    const viewpoint = await Viewpoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!viewpoint) return res.status(404).json({ error: 'Viewpoint not found' });
    res.json({ message: 'Viewpoint updated', viewpoint });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE viewpoint
router.delete('/:id', async (req, res) => {
  try {
    await Viewpoint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Viewpoint deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
