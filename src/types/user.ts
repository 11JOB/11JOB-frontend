// ----------------------------------------------------
// 공통 응답 구조
// ----------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}
/** 회원 가입 요청 (POST /api/user/join 요청 Body) */
export interface JoinRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** 이메일 발송 요청 (POST /api/user/emailSend 요청 Body) */
export interface EmailSendRequest {
  email: string;
}

/** 이메일 인증 확인 요청 (POST /api/user/emailCheck 요청 Body) */
export interface EmailCheckRequest {
  email: string;
  authCode: string; // 인증 코드를 Body에 포함한다고 추론
}

/** 비밀번호 변경 요청 (PATCH /api/user/change-password 요청 Body) */
export interface ChangePasswordRequest {
  email: string;
  newPassword: string;
}

/** 사용자 삭제 (DELETE /api/user/delete-user) */
// Body가 없는 요청으로 확인되었으므로 별도 Request 타입은 없습니다.
