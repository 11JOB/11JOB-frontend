"use client";

interface CommonModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function CommonModal({
  isOpen,
  message,
  onClose,
}: CommonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fadeIn scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">알림</h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold text-sm shadow-md hover:bg-gray-700 active:scale-95 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
