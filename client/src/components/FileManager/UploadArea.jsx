import React, { useRef, useState } from "react";
import axios from "axios";

const UploadArea = ({ currentFolder, onUpload }) => {
  const fileInputRef = useRef();
  const [folderName, setFolderName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (currentFolder) formData.append("parent", currentFolder);

    try {
      await axios.post("http://localhost:8080/api/item/file", formData);
      onUpload();
    } catch (err) {
      console.error("File upload error", err);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) return;
    try {
      await axios.post("http://localhost:8080/api/item/folder", {
        name: folderName,
        parent: currentFolder || null,
      });
      setFolderName("");
      onUpload();
    } catch (err) {
      console.error("Error creating folder", err);
    }
  };

  return (
    <div className="flex gap-4 items-center mt-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload File
      </button>

      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="New folder name"
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={handleCreateFolder}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Create Folder
      </button>
    </div>
  );
};

export default UploadArea;
