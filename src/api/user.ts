/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./instance";
import {
  CommonResponse,
  JoinRequest,
  EmailSendRequest,
  EmailCheckRequest,
  ChangePasswordRequest,
  LoginRequest,
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

  console.log("Login response (headers / data):", {
    headers: response.headers,
    data: response.data,
  });

  // 1) 우선 응답 바디에 토큰이 있는지 확인
  let accessToken =
    (response.data as any)?.accessToken ||
    (response.data as any)?.data?.accessToken;
  let refreshToken =
    (response.data as any)?.refreshToken ||
    (response.data as any)?.data?.refreshToken;

  // 2) 바디에 없으면 헤더에서 꺼내보기
  if (!accessToken) {
    const authHeader =
      response.headers["authorization"] || response.headers["Authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.slice(7);
    }
  }

  if (!refreshToken) {
    refreshToken =
      (response.headers["refresh-token"] as string) ||
      (response.headers["refresh"] as string) ||
      "";
  }

  if (!accessToken || !refreshToken) {
    console.error("예상과 다른 로그인 응답:", {
      headers: response.headers,
      data: response.data,
    });
    throw new Error("로그인 응답 데이터가 올바르지 않습니다.");
  }

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
export async function deleteUser(): Promise<void> {
  await instance.delete(`/api/user/delete-user`);
}
