import instance from "./instance";
import {
  CommonResponse,
  JoinRequest,
  EmailSendRequest,
  EmailCheckRequest,
  ChangePasswordRequest,
  LoginRequest,
  DeleteUserRequest,
} from "../types/user";

/**
 * [POST] 회원 가입을 진행합니다. (/api/user/join)
 */
export async function join(data: JoinRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/api/user/join", data);
}

/**
 * [POST] 이메일을 발송합니다 (인증 코드 포함). (/api/user/emailSend)
 */
export async function sendEmail(data: EmailSendRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/api/user/emailSend", data);
}

/**
 * [POST] 이메일 인증을 확인합니다. (/api/user/emailCheck)
 */
export async function checkEmail(data: EmailCheckRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/api/user/emailCheck", data);
}

/**
 * [POST] 로그인을 진행합니다. (/api/login)
 */
// src/api/user.ts
export async function login(
  data: LoginRequest
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await instance.post("/login", data);

  const accessToken = response.data.accessToken; // accessToken 가져오기
  const refreshToken = response.data.refreshToken; // refreshToken 가져오기

  // 저장 로직 확인
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return { accessToken, refreshToken };
}

/**
 * [POST] 로그아웃을 진행합니다. (/api/user/logout)
 */
export async function logout(): Promise<void> {
  await instance.post<CommonResponse<null>>("/api/user/logout");
}

/**
 * [PATCH] 비밀번호를 변경합니다. (/api/user/change-password)
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  await instance.patch<CommonResponse<null>>("/api/user/change-password", data);
}

/**
 * [DELETE] 사용자를 삭제(탈퇴)합니다. (/api/user/delete-user)
 * (스크린샷에 Body가 없는 요청으로 확인되어, 토큰 기반 삭제를 가정합니다.)
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await instance.delete<CommonResponse<null>>("/api/user/delete-user", {
    data,
  });
}
