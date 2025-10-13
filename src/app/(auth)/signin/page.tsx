"use client";

import React, { useMemo, useState } from "react";
import Input from "../../../components/Input";
import PasswordInput from "../../../components/password-input";
import Button from "../../../components/Button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const canSubmit = useMemo(
    () => email.trim() !== "" && pw.trim() !== "",
    [email, pw]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 로그인 API 연동
    console.log("Sign In:", { email, pw });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 심플 헤더 (선택) */}
      <header className="h-14 flex items-center px-6">
        <div className="font-extrabold text-xl tracking-tight">11JOB</div>
        <div className="ml-3 text-gray-400 text-sm">
          취업일정 정리하고 취뽀하자!
        </div>
      </header>

      {/* 본문 */}
      <main className="px-4">
        <div className="mx-auto max-w-md">
          <div className="mt-20 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-8">
            <h1 className="text-center text-2xl font-bold tracking-tight mb-8">
              로그인
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 아이디(이메일) */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  아이디(이메일)
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="아이디를 입력해주세요"
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  비밀번호
                </label>
                <PasswordInput
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>

              <Button>로그인</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
