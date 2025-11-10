"use client";

import React, { useMemo, useState } from "react";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import clsx from "clsx";

// -----------------------------------------------------------
// 1. Component: Button (컴포넌트 폴더 내의 Button.jsx 역할)
// -----------------------------------------------------------

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  type = "button",
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full rounded-xl h-12 font-semibold text-white transition-colors duration-150",
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black hover:bg-neutral-800 active:bg-neutral-900",
        className
      )}
    >
      {children}
    </button>
  );
};

// -----------------------------------------------------------
// 2. Component: Input (컴포넌트 폴더 내의 input.jsx 역할)
// -----------------------------------------------------------

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  readOnly = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={clsx(
        "w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-800",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800",
        "transition-colors duration-150",
        {
          "bg-gray-100": readOnly,
        },
        className
      )}
    />
  );
};

// -----------------------------------------------------------
// 3. Component: PasswordInput (컴포넌트 폴더 내의 password-input.jsx 역할)
// -----------------------------------------------------------

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "w-full h-12 rounded-xl border border-gray-300 bg-white px-4 pr-10 text-gray-800",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800",
          "transition-colors duration-150",
          className
        )}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {visible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
};

// -----------------------------------------------------------
// 4. Shared Component: ViewHeader
// -----------------------------------------------------------

type AuthView = "signin" | "signup" | "reset";

const ViewHeader: React.FC<{
  title: string;
  onBack: () => void;
  showBack: boolean;
}> = ({ title, onBack, showBack }) => (
  <div className="relative text-center mb-8">
    {showBack && (
      <button
        onClick={onBack}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-black transition"
      >
        <ChevronLeft size={24} />
      </button>
    )}
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
  </div>
);

// -----------------------------------------------------------
// 5. Page: SignUpPage (사용자 요청 컴포넌트)
// -----------------------------------------------------------

const SignUpPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const pwMatch = useMemo(
    () => pw.length >= 8 && pw === pwConfirm,
    [pw, pwConfirm]
  );

  // 인증번호 발송 가능 여부
  const canSendCode = useMemo(
    () => email.trim().includes("@") && !isCodeSent,
    [email, isCodeSent]
  );

  // 전체 제출 가능 여부
  const canSubmit = useMemo(
    () =>
      email.trim() !== "" &&
      emailCode.trim() !== "" &&
      pwMatch &&
      agree &&
      isCodeSent,
    [email, emailCode, pwMatch, agree, isCodeSent]
  );

  // 인증번호 발송 핸들러
  const handleSendCode = () => {
    if (!canSendCode) return;
    // TODO: 실제 이메일 인증번호 발송 API 연동
    setIsCodeSent(true);
    console.log("Send verification code to:", email);
    alert(`[${email}]로 인증번호가 발송되었습니다. (시뮬레이션)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 회원가입 API 연동
    console.log("Sign Up Success:", { email, emailCode, pw });
    alert("회원가입이 성공적으로 완료되었습니다.");
    onBack(); // 회원가입 성공 후 로그인 화면으로 복귀
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 p-8 w-full transition-opacity duration-300">
      <ViewHeader title="회원가입" onBack={onBack} showBack={true} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 아이디(이메일) 및 인증번호 발송 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            아이디(이메일)
          </label>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력해주세요"
              type="email"
              readOnly={isCodeSent}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!canSendCode}
              className={clsx(
                "whitespace-nowrap px-4 rounded-xl text-sm font-semibold transition-colors duration-150",
                canSendCode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              )}
            >
              {isCodeSent ? "재전송" : "인증번호 발송"}
            </button>
          </div>
        </div>

        {/* 이메일 인증번호 입력 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            이메일 인증번호 입력
          </label>
          <Input
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            placeholder="이메일 인증번호 6자리를 입력해주세요"
            type="text"
            className="appearance-none"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            비밀번호 (8자 이상)
          </label>
          <PasswordInput
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
          {pw.length > 0 && pw.length < 8 && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호는 최소 8자 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            비밀번호 확인
          </label>
          <PasswordInput
            value={pwConfirm}
            onChange={(e) => setPwConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
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
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          개인정보 이용 및 수집 동의
        </label>

        {/* 버튼 */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={!canSubmit}
            className={clsx({ "bg-black": canSubmit })}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
};

// -----------------------------------------------------------
// 6. Page: ResetPasswordPage (비밀번호 재설정 페이지)
// -----------------------------------------------------------

const ResetPasswordPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const canSubmit = useMemo(() => email.trim().includes("@"), [email]);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 비밀번호 재설정 API 연동
    console.log("Reset Password for:", email);
    alert(`[${email}]로 비밀번호 재설정 이메일이 전송되었습니다. (시뮬레이션)`);
    onBack();
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 p-8 w-full transition-opacity duration-300">
      <ViewHeader title="비밀번호 재설정" onBack={onBack} showBack={true} />

      <p className="text-gray-600 mb-6 text-left text-sm">
        가입 시 사용했던 이메일 주소를 입력해주세요. 비밀번호 재설정 링크를
        보내드립니다.
      </p>

      <form onSubmit={handleResetSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 text-left">
            이메일
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력해주세요"
            type="email"
          />
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          className={clsx({ "bg-black": canSubmit })}
        >
          재설정 이메일 받기
        </Button>
      </form>
    </div>
  );
};

// -----------------------------------------------------------
// 7. Page: SignInPage (로그인 페이지)
// -----------------------------------------------------------

const SignInPage: React.FC<{ handleNavigation: (view: AuthView) => void }> = ({
  handleNavigation,
}) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const canSubmit = useMemo(
    () => email.trim() !== "" && pw.trim() !== "",
    [email, pw]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 로그인 API 연동 로직
    console.log("Sign In:", { email, pw });
    alert("로그인 성공 (실제 라우팅 없음)");
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 p-8 w-full transition-opacity duration-300">
      <ViewHeader
        title="로그인"
        onBack={() => {}} // 로그인 뷰에서는 뒤로가기 버튼 없음
        showBack={false}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 아이디(이메일) */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            아이디(이메일)
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디를 입력해주세요"
            type="email"
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

        <Button
          type="submit"
          disabled={!canSubmit}
          className={clsx({ "bg-black": canSubmit })}
        >
          로그인
        </Button>
      </form>

      {/* 회원가입 / 비밀번호 찾기 링크 */}
      <div className="mt-6 text-center text-sm space-x-2">
        <span
          className="text-gray-600 hover:text-black cursor-pointer transition duration-150 font-medium"
          onClick={() => handleNavigation("signup")} // 뷰 전환: 회원가입 (라우팅 시뮬레이션)
        >
          회원가입
        </span>
        <span className="text-gray-400">|</span>
        <span
          className="text-gray-600 hover:text-black cursor-pointer transition duration-150 font-medium"
          onClick={() => handleNavigation("reset")} // 뷰 전환: 비밀번호 찾기 (라우팅 시뮬레이션)
        >
          비밀번호 찾기
        </span>
      </div>
    </div>
  );
};

// -----------------------------------------------------------
// 8. Main App Component (라우팅 역할)
// -----------------------------------------------------------

export default function App() {
  // 뷰 상태: URL 경로를 시뮬레이션합니다.
  const [currentView, setCurrentView] = useState<AuthView>("signin");

  // 라우팅 핸들러
  const handleNavigation = (view: AuthView) => {
    setCurrentView(view);
  };

  // 뷰 렌더링
  const renderContent = () => {
    switch (currentView) {
      case "signin":
        return <SignInPage handleNavigation={handleNavigation} />;

      case "signup":
        // SignUpPage 컴포넌트를 렌더링하고, 뒤로가기 시 'signin'으로 이동하도록 설정
        return <SignUpPage onBack={() => handleNavigation("signin")} />;

      case "reset":
        return <ResetPasswordPage onBack={() => handleNavigation("signin")} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="px-4">
        <div className="mx-auto max-w-md">
          {/* 중앙 정렬 */}
          <div className="flex flex-col justify-center min-h-screen py-8 md:py-12">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
