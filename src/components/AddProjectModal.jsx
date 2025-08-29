// src/components/AddProjectModal.js
import React from 'react';

const AddProjectModal = ({ 
  show, 
  projectName, 
  setProjectName, 
  onAdd, 
  onCancel 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            autoFocus
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;