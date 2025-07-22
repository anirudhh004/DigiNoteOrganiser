import React from "react";

const Breadcrumbs = ({ path, onClick }) => {
  return (
    <div className="text-sm text-gray-700 mb-2">
      <span className="cursor-pointer" onClick={() => onClick(null)}>
        Home
      </span>
      {path.map((folder, index) => (
        <span key={folder.id}>
          {" / "}
          <span
            className="cursor-pointer text-blue-600"
            onClick={() => onClick(folder.id)}
          >
            {folder.name}
          </span>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
