"use client";

import React, { useMemo, useState } from "react";
import Input from "../../../components/Input";
import PasswordInput from "../../../components/password-input";
import Button from "../../../components/Button";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const pwMatch = useMemo(() => pw !== "" && pw === pwConfirm, [pw, pwConfirm]);
  const canSubmit = useMemo(
    () => email.trim() !== "" && emailCode.trim() !== "" && pwMatch && agree,
    [email, emailCode, pwMatch, agree]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 회원가입 API 연동
    console.log("Sign Up:", { email, emailCode, pw });
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
          <div className="mt-16 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-8">
            <h1 className="text-center text-2xl font-bold tracking-tight mb-8">
              회원가입
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

              {/* 이메일 인증번호 입력 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  이메일 인증번호 입력
                </label>
                <Input
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="이메일 인증번호를 입력해주세요"
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

              {/* 비밀번호 확인 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  비밀번호 확인
                </label>
                <PasswordInput
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                />
                {!pwMatch && pwConfirm.length > 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {/* 개인정보 동의 */}
              <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                개인정보 이용 및 수집 동의
              </label>

              {/* 버튼 */}
              <Button disabled>회원가입</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
