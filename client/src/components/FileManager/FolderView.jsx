import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileIcon,
  FolderIcon,
  ImageIcon,
  FileTextIcon,
  FilePieChartIcon 
} from "lucide-react";

const FolderView = ({ items, onOpenFolder, onDelete, onMoveItem }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hoverTarget, setHoverTarget] = useState(null);

  const getFileIcon = (fileType) => {
    if (fileType === "pdf") return <FileTextIcon className="inline mr-1" size={16} />;
    if (fileType === "doc" || fileType === "docx") return <FileIcon className="inline mr-1" size={16} />;
    if (fileType === "ppt" || fileType === "pptx") return <FilePieChartIcon className="inline mr-1" size={16} />;
    if (fileType === "img" || fileType?.includes("image")) return <ImageIcon className="inline mr-1" size={16} />;
    return <FileIcon className="inline mr-1" size={16} />;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={cn(
              "p-3 border rounded shadow group relative transition-colors",
              item.type === "folder"
                ? "bg-muted hover:bg-accent"
                : "bg-background",
              hoverTarget === item._id && "ring-2 ring-blue-500"
            )}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("itemId", item._id);
              e.dataTransfer.setData("itemType", item.type);
            }}
            onDragOver={(e) => {
              if (item.type === "folder") {
                e.preventDefault();
                setHoverTarget(item._id);
              }
            }}
            onDragLeave={() => setHoverTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              const draggedItemId = e.dataTransfer.getData("itemId");
              const draggedItemType = e.dataTransfer.getData("itemType");
              setHoverTarget(null);

              if (item.type === "folder" && draggedItemId && draggedItemType !== "folder") {
                onMoveItem(draggedItemId, item._id);
              }
            }}
          >
            <div
              className="cursor-pointer font-medium"
              onClick={() => {
                if (item.type === "folder") {
                  onOpenFolder(item._id);
                } else if (item.fileUrl) {
                  const fileUrl = `http://localhost:8080${encodeURI(item.fileUrl)}`;
                  window.open(fileUrl, "_blank");
                } else {
                  console.warn("File URL is missing for item:", item);
                }
              }}
            >
              {item.type === "folder"
                ? <FolderIcon className="inline mr-1" size={16} />
                : getFileIcon(item.fileType)}
              {item.name}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(item);
              }}
              className="absolute top-2 right-2 text-red-500 text-xs hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(deleteTarget._id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FolderView;
