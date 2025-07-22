import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumbs from "./Breadcrumbs";
import UploadArea from "./UploadArea";
import FolderView from "./FolderView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

function FileManager() {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [rootFolders, setRootFolders] = useState([]);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  const fetchFolderContents = async (folderId = null) => {
    try {
      const res = folderId
        ? await axios.get(`http://localhost:8080/api/item/folder/${folderId}`)
        : await axios.get("http://localhost:8080/api/item/folders/root");

      setItems(res.data);
      setCurrentFolder(folderId);
      const path = folderId ? await buildBreadcrumbs(folderId) : [];
      setBreadcrumbs(path);
    } catch (err) {
      console.error("Failed to fetch folder contents", err);
    }
  };

  const fetchRootFolders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/item/folders/root");
      setRootFolders(res.data);
    } catch (err) {
      console.error("Failed to fetch root folders", err);
    }
  };

  const buildBreadcrumbs = async (folderId) => {
    const path = [];
    let current = folderId;
    while (current) {
      const res = await axios.get(`http://localhost:8080/api/item/${current}`);
      const folder = res.data;
      if (!folder) break;
      path.unshift({ id: folder._id, name: folder.name });
      current = folder.parent;
    }
    return path;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/item/${id}`);
      fetchFolderContents(currentFolder);
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleMoveItem = async (itemId, newParentId) => {
    try {
      await axios.put(`http://localhost:8080/api/item/${itemId}`, {
        parent: newParentId,
      });
      fetchFolderContents(currentFolder);
      fetchRootFolders();
    } catch (err) {
      console.error("Error moving item:", err);
    }
  };

  useEffect(() => {
    fetchFolderContents();
    fetchRootFolders();
  }, []);

  return (
    <div className="flex h-[calc(100vh-100px)] rounded-lg border bg-card text-card-foreground shadow overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted p-4 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-3">Folders</h2>

        <div
          className={cn(
            "cursor-pointer mb-2 px-2 py-1 rounded hover:bg-muted-foreground/10",
            dragOverTarget === "home" && "bg-accent/40"
          )}
          onClick={() => fetchFolderContents(null)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverTarget("home");
          }}
          onDragLeave={() => setDragOverTarget(null)}
          onDrop={(e) => {
            e.preventDefault();
            const draggedItemId = e.dataTransfer.getData("itemId");
            const draggedItemType = e.dataTransfer.getData("itemType");
            if (draggedItemId && draggedItemType !== "folder") {
              handleMoveItem(draggedItemId, null);
            }
            setDragOverTarget(null);
          }}
        >
          🏠 <span className="ml-1">Home</span>
        </div>

        <ScrollArea className="pr-2 space-y-1">
          {rootFolders.map((folder) => (
            <div
              key={folder._id}
              className={cn(
                "cursor-pointer px-2 py-1 rounded hover:bg-muted-foreground/10",
                dragOverTarget === folder._id && "bg-accent/40"
              )}
              onClick={() => fetchFolderContents(folder._id)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverTarget(folder._id);
              }}
              onDragLeave={() => setDragOverTarget(null)}
              onDrop={(e) => {
                e.preventDefault();
                const draggedItemId = e.dataTransfer.getData("itemId");
                const draggedItemType = e.dataTransfer.getData("itemType");
                if (draggedItemId && draggedItemType !== "folder") {
                  handleMoveItem(draggedItemId, folder._id);
                }
                setDragOverTarget(null);
              }}
            >
              📁 <span className="ml-1">{folder.name}</span>
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* 🔙 Back Button */}
        {currentFolder && (
          <button
            className="mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground transition"
            onClick={async () => {
              try {
                const res = await axios.get(`http://localhost:8080/api/item/${currentFolder}`);
                const parentId = res.data?.parent || null;
                fetchFolderContents(parentId);
              } catch (err) {
                console.error("Failed to go back", err);
              }
            }}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back
          </button>
        )}

        <Breadcrumbs path={breadcrumbs} onClick={fetchFolderContents} />
        <UploadArea
          currentFolder={currentFolder}
          onUpload={() => fetchFolderContents(currentFolder)}
        />
        <FolderView
          items={items}
          onOpenFolder={fetchFolderContents}
          onDelete={handleDelete}
          onMoveItem={handleMoveItem}
        />
      </div>
    </div>
  );
}

export default FileManager;
