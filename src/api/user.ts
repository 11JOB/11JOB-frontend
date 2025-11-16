import instance from "./instance";
import {
  CommonResponse,
  JoinRequest,
  EmailSendRequest,
  EmailCheckRequest,
  ChangePasswordRequest,
} from "../types/user";

/**
 * [POST] 회원 가입을 진행합니다. (/api/user/join)
 */
export async function join(data: JoinRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/user/join", data);
}

/**
 * [POST] 이메일을 발송합니다 (인증 코드 포함). (/api/user/emailSend)
 */
export async function sendEmail(data: EmailSendRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/user/emailSend", data);
}

/**
 * [POST] 이메일 인증을 확인합니다. (/api/user/emailCheck)
 */
export async function checkEmail(data: EmailCheckRequest): Promise<void> {
  await instance.post<CommonResponse<null>>("/user/emailCheck", data);
}

/**
 * [PATCH] 비밀번호를 변경합니다. (/api/user/change-password)
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  await instance.patch<CommonResponse<null>>("/user/change-password", data);
}

/**
 * [DELETE] 사용자를 삭제(탈퇴)합니다. (/api/user/delete-user)
 * (스크린샷에 Body가 없는 요청으로 확인되어, 토큰 기반 삭제를 가정합니다.)
 */
export async function deleteUser(): Promise<void> {
  await instance.delete(`/user/delete-user`);
}
