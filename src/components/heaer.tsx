"use client";
import React from "react";
// Next.js 라우터 대신 시뮬레이션을 위한 더미 함수를 사용합니다.
// 실제 환경에서는 next/navigation에서 useRouter를 import하여 사용하십시오.
// Lucide Icons를 사용합니다.
import { LogOut, User as UserIcon } from "lucide-react";
// import { useRouter } from "next/navigation"; // 실제 Next.js 환경

// useRouter 시뮬레이션
const useDummyRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
});

interface HeaderProps {
  userEmail?: string;
}

export default function Header({
  userEmail = "testuser@11job.com",
}: HeaderProps) {
  const router = useDummyRouter(); // 실제 환경에서는 useRouter();

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 (예: Firebase/Auth 세션 삭제)이 들어갈 자리
    console.log("Logout attempted.");
    router.push("/auth"); // 로그인 페이지로 이동 시뮬레이션
  };

  return (
    // 헤더 컨테이너: 약간의 그림자 추가, 고정 높이
    <header className="w-full h-[64px] bg-white border-b border-gray-100 shadow-md flex items-center justify-between px-6 sticky top-0 z-10">
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

      {/* 사용자 정보 및 로그아웃 영역 */}
      <div className="flex flex-row items-center space-x-4">
        {/* 사용자 이메일 */}
        <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-full">
          <UserIcon size={16} className="text-gray-500" />
          <p className="text-gray-700 text-sm font-medium leading-relaxed tracking-tight">
            {userEmail}
          </p>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <LogOut size={16} className="mr-1" />
          로그아웃
        </button>
      </div>
    </header>
  );
}
