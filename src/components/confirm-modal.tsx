"use client";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fadeIn scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">확인</h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold text-sm shadow-md hover:bg-gray-400 active:scale-95 transition-all"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm shadow-md hover:bg-red-700 active:scale-95 transition-all"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
