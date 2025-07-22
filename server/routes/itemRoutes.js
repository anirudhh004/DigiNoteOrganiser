const express = require("express");
const router = express.Router();

const {
  createFolder,
  uploadFile,
  upload, 
  getFolderContents,
  updateItem,
  deleteItem,
  getAllRootFolders,
  getItemById,
} = require("../controllers/itemController");

const validateTokenHandler = require("../middleware/validateTokenHandler");


router.use(validateTokenHandler);


router.post("/folder", createFolder);
router.post("/file", upload.single("file"), uploadFile); // ✅ Correct multer usage
router.get("/folder/:folderId", getFolderContents);
router.get("/folders/root", getAllRootFolders);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
