"use client";

import React from "react";

interface CommonModalProps {
  isOpen: boolean;
  message: React.ReactNode; // string -> React.ReactNode로 변경
}

const CommonCancelModal: React.FC<CommonModalProps> = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fadeIn scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">알림</h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="mt-6 flex justify-end"></div>
      </div>
    </div>
  );
};

export default CommonCancelModal;
