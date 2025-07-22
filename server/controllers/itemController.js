const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Item = require("../models/itemModel");

// Create uploads folder if it doesn't exist
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Helper to delete local file
const deleteLocalFile = (fileUrl) => {
  const filePath = path.join(__dirname, "..", fileUrl);
  fs.unlink(filePath, (err) => {
    if (err) console.warn("Local file deletion error:", err.message);
  });
};


// @desc    Create new Folder
// @route   POST /api/item/folder
// @access  Private
const createFolder = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const user_id = req.user.id;

    const folder = await Item.create({
      name,
      type: "folder",
      parent: parent || null,
      user_id,
    });

    if (parent) {
      const parentFolder = await Item.findOne({ _id: parent, user_id });
      if (!parentFolder) return res.status(403).json({ message: "Unauthorized parent folder" });

      await Item.findByIdAndUpdate(parent, {
        $push: { children: folder._id },
      });
    }

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Error creating folder", error });
  }
};


// @desc    Uploads the file 
// @route   POST /api/item/file
// @access  Private
const uploadFile = async (req, res) => {
  try {
    const { parent } = req.body;
    const user_id = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (parent) {
      const parentFolder = await Item.findOne({ _id: parent, user_id });
      if (!parentFolder) return res.status(403).json({ message: "Unauthorized parent folder" });
    }

    const { originalname, mimetype, filename } = req.file;
    const fileUrl = `/uploads/${filename}`;

    const fileDoc = await Item.create({
      name: originalname,
      type: "file",
      fileType: mimetype.split("/")[1],
      fileUrl,
      parent: parent || null,
      user_id,
    });

    if (parent) {
      await Item.findByIdAndUpdate(parent, {
        $push: { children: fileDoc._id },
      });
    }

    res.status(201).json({ message: "File uploaded", data: fileDoc });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

// @desc    Get Folder contents
// @route   GET /api/item/folder/:folderId
// @access  Private
const getFolderContents = async (req, res) => {
  try {
    const { folderId } = req.params;
    const user_id = req.user.id;

    const folder = await Item.findOne({ _id: folderId, user_id });
    if (!folder) return res.status(403).json({ message: "Unauthorized folder access" });

    const contents = await Item.find({ parent: folderId, user_id });
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching folder contents", error });
  }
};

// @desc    Use to change the parent folder of a file
// @route   PUT /api/item/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fileUrl, parent } = req.body;
    const user_id = req.user.id;

    const item = await Item.findOne({ _id: id, user_id });
    if (!item) return res.status(404).json({ message: "Item not found or unauthorized" });

    if (parent && parent !== item.parent?.toString()) {
      const newParent = await Item.findOne({ _id: parent, user_id });
      if (!newParent) return res.status(403).json({ message: "Unauthorized new parent folder" });

      if (item.parent) {
        await Item.findByIdAndUpdate(item.parent, {
          $pull: { children: item._id },
        });
      }

      await Item.findByIdAndUpdate(parent, {
        $addToSet: { children: item._id },
      });

      item.parent = parent;
    }

    if (name) item.name = name;
    if (fileUrl && item.type === "file") item.fileUrl = fileUrl;

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// @desc    Deletes the item
// @route   DELETE /api/item/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const item = await Item.findOne({ _id: id, user_id });
    if (!item) return res.status(404).json({ message: "Item not found or unauthorized" });

    if (item.parent) {
      await Item.findByIdAndUpdate(item.parent, {
        $pull: { children: item._id },
      });
    }

    if (item.type === "folder") {
      await deleteChildrenRecursive(item._id, user_id);
    }

    if (item.type === "file" && item.fileUrl) {
      deleteLocalFile(item.fileUrl);
    }

    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

const deleteChildrenRecursive = async (parentId, user_id) => {
  const children = await Item.find({ parent: parentId, user_id });

  for (const child of children) {
    if (child.type === "folder") {
      await deleteChildrenRecursive(child._id, user_id);
    }

    if (child.type === "file" && child.fileUrl) {
      deleteLocalFile(child.fileUrl);
    }

    await Item.findByIdAndDelete(child._id);
  }
};

// @desc    Gives all the root folder
// @route   GET /api/item/folders/root
// @access  Private
const getAllRootFolders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const folders = await Item.find({
      type: "folder",
      parent: null,
      user_id,
    });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching root folders", error });
  }
};

// @desc    Get single items by id
// @route   GET /api/item/:id
// @access  Private
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const item = await Item.findOne({ _id: id, user_id });
    if (!item) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

module.exports = {
  createFolder,
  uploadFile,
  upload, 
  getFolderContents,
  updateItem,
  deleteItem,
  getAllRootFolders,
  getItemById,
};
