import React from "react";

export const CategorySelected = () => {
  return (
    <div className="bg-gray-200 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Hearing Issues</h2>

      <button className="px-4 py-2 bg-blue-500 text-white rounded-full mr-2 mb-2">
        Say Again!
      </button>

      <button className="px-4 py-2 bg-blue-500 text-white rounded-full mr-2 mb-2">
        Adjust Volume
      </button>
    </div>
  );
};
