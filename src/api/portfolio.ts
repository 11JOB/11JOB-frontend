// src/api/portfolio.ts
import instance from "./instance";
import {
  CommonResponse,
  Portfolio,
  CreatePortfolioRequest,
  PortfolioResponse,
} from "../types/portfolio";

/**
 * [POST] 새 포트폴리오를 추가합니다. (/api/portfolio)
 * Swagger 기준: multipart/form-data
 * - dto: JSON (required)
 * - profileImage: file(binary) (optional)
 */

export async function createPortfolio(
  dto: CreatePortfolioRequest,
  profileImageFile?: File | null
): Promise<Portfolio> {
  const formData = new FormData();

  // dto 부분: JSON 문자열을 Blob 으로 감싸서 전송
  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], {
      type: "application/json",
    })
  );

  // profileImage 부분: 선택적 파일
  if (profileImageFile) {
    formData.append("profileImage", profileImageFile);
  }

  try {
    const response = await instance.post<CommonResponse<Portfolio>>(
      "/api/portfolio",
      formData,
      {
        // ✨ 기본 transformRequest(JSON 직렬화)를 끄고, FormData 그대로 보내기
        transformRequest: (data) => data,
        // ⚠️ Content-Type은 직접 지정하지 않고 브라우저에게 맡기는 게 안전함
      }
    );

    return response.data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "❌ createPortfolio API 호출 중 오류 발생:",
      error.response || error
    );
    throw new Error(
      error.response?.data?.message ||
        "포트폴리오 저장 중 서버 오류가 발생했습니다."
    );
  }
}
/**
 * [GET] 포트폴리오 정보를 조회합니다. (/api/portfolio)
 */
export async function getPortfolio(): Promise<PortfolioResponse> {
  const res = await instance.get<PortfolioResponse>("/api/portfolio");
  return res.data; // ← 이때만 res.data
}
