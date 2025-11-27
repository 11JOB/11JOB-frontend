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

  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  // ✅ profileImage를 binary 파일로 전송 (선택)
  if (profileImageFile) {
    formData.append("profileImage", profileImageFile);
  }

  const response = await instance.post<CommonResponse<Portfolio>>(
    "/api/portfolio",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}

/**
 * [GET] 포트폴리오 정보를 조회합니다. (/api/portfolio)
 */
export async function getPortfolio(): Promise<PortfolioResponse> {
  const res = await instance.get<PortfolioResponse>("/api/portfolio");
  return res.data; // ← 이때만 res.data
}
