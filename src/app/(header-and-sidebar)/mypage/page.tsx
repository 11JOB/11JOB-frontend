/**
 * 독립적인 마이페이지 애플리케이션 (Mock Data 전용)
 * - 사용자 프로필 정보와 로그아웃 기능을 제공하는 단일 페이지입니다.
 * - 이전 채용 일정 관리 로직과는 완전히 분리되어 있습니다.
 */
"use client";

import React from "react";
import { User, LogOut, Settings, ChevronLeft } from "lucide-react";
import Image from "next/image";

// -----------------------------------------------------------------------------
// 1. 목 데이터 (Mock Data)
// -----------------------------------------------------------------------------

const MOCK_USER = {
  name: "김수현",
  email: "kim.suhyeon@jobtracker.com",
  profileUrl: "https://placehold.co/100x100/3b82f6/ffffff?text=KS",
};

// -----------------------------------------------------------------------------
// 2. 컴포넌트: MyPageView (마이페이지 뷰)
// -----------------------------------------------------------------------------

const MyPageView: React.FC<{
  user: typeof MOCK_USER;
}> = ({ user }) => {
  const handleLogout = () => {
    // 실제 로그아웃 로직은 없으므로, 사용자에게 알림만 띄웁니다.
    alert("로그아웃이 시도되었습니다. (목업 기능)");
    console.log("Mock Logout initiated.");
  };

  const handleNavigation = (action: string) => {
    alert(`${action} 페이지로 이동합니다. (목업)`);
    console.log(`Mock Navigation to: ${action}`);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <User className="w-7 h-7 mr-3 text-blue-500" />
          마이페이지 (독립 파일)
        </h1>
        <p className="text-base text-gray-500 mt-1">
          회원 정보 확인 및 계정 설정 기능을 제공합니다.
        </p>
      </header>

      {/* 프로필 카드 */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <Image
          src={user.profileUrl}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/100x100/3b82f6/ffffff?text=User";
          }}
        />
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
        </div>
      </div>

      {/* 설정 및 기능 목록 */}
      <section className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">계정 관리</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {/* 계정 설정 버튼 */}
          <button
            className="w-full text-left flex items-center justify-between p-4 text-gray-700 hover:bg-gray-50 transition duration-150 rounded-t-xl"
            onClick={() => handleNavigation("계정 설정")}
          >
            <span className="flex items-center">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              계정 설정
            </span>
            <ChevronLeft className="w-4 h-4 transform rotate-180 text-gray-400" />
          </button>

          {/* 로그아웃 버튼 */}
          <button
            className="w-full text-left flex items-center justify-between p-4 text-red-600 hover:bg-red-50 transition duration-150 rounded-b-xl"
            onClick={handleLogout}
          >
            <span className="flex items-center font-semibold">
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              로그아웃
            </span>
            <ChevronLeft className="w-4 h-4 transform rotate-180 text-red-400" />
          </button>
        </div>
      </section>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 3. 메인 컴포넌트 (App)
// -----------------------------------------------------------------------------

export default function App() {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 font-sans">
      <div className="max-w-xl mx-auto py-10">
        <MyPageView user={MOCK_USER} />
      </div>
    </div>
  );
}
