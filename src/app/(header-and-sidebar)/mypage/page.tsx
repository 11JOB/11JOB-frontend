// src/app/(header-and-sidebar)/mypage/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  LogOut,
  ChevronLeft,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { changePassword, deleteUser, logout, getUserName } from "@/api/user";

// -----------------------------------------------------------------------------
// 마이페이지 컴포넌트
// -----------------------------------------------------------------------------
export default function MyPage() {
  // 사용자 정보
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // 비밀번호 변경 상태
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // 회원 탈퇴 상태
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 로그아웃 상태
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // 사용자 이름 + 이메일 로드
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // 닉네임은 백엔드에서
        const name = await getUserName();
        setUserName(name);
      } catch (e) {
        console.error("❌ 사용자 이름 조회 실패:", e);
        setUserName("알 수 없는 사용자");
      }

      // 이메일은 로그인 시 저장해 둔 localStorage 에서
      if (typeof window !== "undefined") {
        const email = localStorage.getItem("userEmail");
        if (email) setUserEmail(email);
      }
    };

    loadUserInfo();
  }, []);

  // ---------------------------------------------------------------------------
  // 핸들러: 로그아웃
  // ---------------------------------------------------------------------------
  const handleLogout = async () => {
    const ok = confirm("정말 로그아웃 하시겠습니까?");
    if (!ok) return;

    try {
      setLogoutLoading(true);
      await logout();

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
      }

      alert("로그아웃되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error("❌ 로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLogoutLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 핸들러: 비밀번호 변경
  // ---------------------------------------------------------------------------
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      alert("새 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    try {
      setPwLoading(true);
      await changePassword({
        oldPassword,
        newPassword,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");

      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      console.error("❌ 비밀번호 변경 실패:", err);
      alert(
        "비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해 주세요."
      );
    } finally {
      setPwLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 핸들러: 회원 탈퇴
  // ---------------------------------------------------------------------------
  const handleDeleteUser = async () => {
    if (!deletePassword) {
      alert("회원 탈퇴를 위해 비밀번호를 입력해주세요.");
      return;
    }

    const ok = confirm(
      "정말로 회원 탈퇴를 진행하시겠습니까?\n\n계정과 관련된 데이터가 삭제될 수 있습니다."
    );
    if (!ok) return;

    try {
      setDeleteLoading(true);
      await deleteUser({ password: deletePassword }); // DeleteUserRequest = { password: string }

      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
      }
      window.location.href = "/";
    } catch (err) {
      console.error("❌ 회원 탈퇴 실패:", err);
      alert("회원 탈퇴에 실패했습니다. 비밀번호를 다시 확인해 주세요.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 렌더링
  // ---------------------------------------------------------------------------
  // 이니셜용 한 글자 (이름 없으면 ?)
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex-1 min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-0 space-y-8">
        {/* 헤더 */}
        <header className="border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <User className="w-7 h-7 mr-3 text-blue-500" />
            마이페이지
          </h1>
          <p className="text-base text-gray-500 mt-1">
            회원 정보 확인 및 비밀번호 변경, 회원 탈퇴를 관리할 수 있습니다.
          </p>
        </header>

        {/* 프로필 카드 (프로필 이미지 없음, 이니셜 원형 배지) */}
        <section className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {initial}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {userName || "로그인 사용자"}
            </h2>
            <p className="text-gray-600 text-lg">
              {userEmail || "이메일 정보가 없습니다."}
            </p>
          </div>
        </section>

        {/* 계정 관리 - 로그아웃 */}
        <section className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">계정 관리</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <button
              className="w-full text-left flex items-center justify-between p-4 text-red-600 hover:bg-red-50 transition duration-150 rounded-xl"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              <span className="flex items-center font-semibold">
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                {logoutLoading ? "로그아웃 중..." : "로그아웃"}
              </span>
              <ChevronLeft className="w-4 h-4 transform rotate-180 text-red-400" />
            </button>
          </div>
        </section>

        {/* 비밀번호 변경 섹션 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800">비밀번호 변경</h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            현재 비밀번호를 입력한 뒤, 새 비밀번호를 설정해주세요.
          </p>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                현재 비밀번호
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                새 비밀번호
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요 (최소 8자)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="다시 한 번 입력해주세요"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {pwLoading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </div>
          </div>
        </section>

        {/* 회원 탈퇴 섹션 */}
        <section className="bg-white rounded-xl shadow-sm border border-red-200 p-6 space-y-5">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-red-700">회원 탈퇴</h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            회원 탈퇴를 진행하면 계정과 관련된 데이터가 삭제되거나 복구가 어려울
            수 있습니다. 신중하게 진행해주세요.
          </p>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "탈퇴 처리 중..." : "회원 탈퇴"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
