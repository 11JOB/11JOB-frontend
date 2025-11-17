"use client";
import React, { useEffect, useState } from "react";
import { LogOut, LogIn, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 로그인 상태 추가
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 이메일과 토큰 가져오기
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("accessToken");
    setUserEmail(email);
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  const handleLogout = () => {
    // 로그아웃 시 로컬 스토리지 초기화
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false); // 로그인 상태 해제
    console.log("Logout successful.");
    router.push("/auth"); // 로그인 페이지로 이동
  };

  const handleLogin = () => {
    router.push("/auth"); // 로그인 페이지로 이동
  };

  return (
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

      {/* 사용자 정보 및 로그인/로그아웃 영역 */}
      <div className="flex flex-row items-center space-x-4">
        {/* 사용자 이메일 */}
        {isLoggedIn && userEmail && (
          <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-full">
            <UserIcon size={16} className="text-gray-500" />
            <p className="text-gray-700 text-sm font-medium leading-relaxed tracking-tight">
              {userEmail}
            </p>
          </div>
        )}

        {/* 로그인/로그아웃 버튼 */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <LogOut size={16} className="mr-1" />
            로그아웃
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold shadow-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <LogIn size={16} className="mr-1" />
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
