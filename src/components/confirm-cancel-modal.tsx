"use client";

import React from "react";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fadeIn scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">알림</h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="mt-6 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            취소
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
