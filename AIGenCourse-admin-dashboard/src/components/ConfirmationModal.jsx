// src/components/ConfirmationModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-red-700">{title}</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
            </button>
        </div>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;