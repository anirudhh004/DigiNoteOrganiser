const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["folder", "file"],
    required: true,
  },

  fileType: {
    type: String,
    default: null, 
  },

  fileUrl: {
    type: String,
    default: null, 
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    default: null, 
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", itemSchema);
