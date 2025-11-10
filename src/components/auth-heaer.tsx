"use client";
import React from "react";
// Next.js 라우터 대신 시뮬레이션을 위한 더미 함수를 사용합니다.
// 실제 환경에서는 next/navigation에서 useRouter를 import하여 사용하십시오.
// import { useRouter } from "next/navigation"; // 실제 Next.js 환경

// useRouter 시뮬레이션
const useDummyRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
});

export default function AuthHeader() {
  const router = useDummyRouter(); // 실제 환경에서는 useRouter();

  return (
    // 헤더 컨테이너: 약간의 그림자 추가, 고정 높이
    <header className="w-full h-[64px] bg-white border-b border-gray-100 shadow-sm flex items-center justify-start px-6 sticky top-0 z-10">
      {/* 로고 영역 */}
      <div
        className="flex items-center cursor-pointer select-none group"
        onClick={() => router.push("/")}
      >
        <p className="text-3xl font-extrabold tracking-tight text-blue-600 transition duration-150 group-hover:text-blue-500">
          11JOB
        </p>
        <span className="text-gray-500 text-xs tracking-tight ml-2 font-medium hidden sm:inline">
          상세한 취업일정 관리를 통해 취뽀하자!
        </span>
      </div>

      {/* 이 헤더는 인증 요소(로그인, 사용자 정보)를 포함하지 않습니다. */}
    </header>
  );
}
