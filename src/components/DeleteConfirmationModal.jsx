// src/components/DeleteConfirmationModal.js
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ show, onCancel, onConfirm, itemName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete this {itemName || 'transaction'}? This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
