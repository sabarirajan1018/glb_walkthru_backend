const mongoose = require('mongoose');

const viewpointSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number, required: true },
    },
    rotation: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
    modelId: { type: String, default: 'default' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Viewpoint', viewpointSchema);
