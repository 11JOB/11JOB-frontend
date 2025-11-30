"use client";

import { useRouter } from "next/navigation";

interface CompleteModalProps {
  message: string;
  route?: string;
  pagemessage?: string;
  onClose?: () => void;
}

export default function CompleteLoginModal({
  message,
  route,
  pagemessage,
  onClose,
}: CompleteModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fadeIn scale-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">로그인 성공!</h2>

        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* Button Area */}
        <div className="mt-6 flex justify-end">
          {route ? (
            <button
              onClick={() => router.push(route)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {pagemessage} 이동하기
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold text-sm shadow-md hover:bg-gray-700 active:scale-95 transition-all"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
