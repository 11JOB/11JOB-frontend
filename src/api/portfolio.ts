import instance from "./instance";
import {
  CommonResponse,
  Portfolio,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "../types/portfolio"; // 타입 파일 경로 조정 필요

/**
 * [POST] 새 포트폴리오를 추가합니다. (/api/portfolio)
 * @param data 포트폴리오 생성에 필요한 데이터 (name, description)
 * @returns 생성된 Portfolio 객체
 */
export async function createPortfolio(
  data: CreatePortfolioRequest
): Promise<Portfolio> {
  const response = await instance.post<CommonResponse<Portfolio>>(
    "/api/portfolio",
    data
  );
  return response.data.data;
}

/**
 * [GET] 포트폴리오 정보를 조회합니다. (/api/portfolio)
 * (개인 포트폴리오이므로 ID 없이 토큰 기반으로 조회한다고 추론)
 * @returns 상세 Portfolio 객체
 */
export async function getPortfolio(): Promise<Portfolio> {
  const response = await instance.get<CommonResponse<Portfolio>>("/portfolio");
  return response.data.data;
}

/**
 * [PUT] 포트폴리오 정보를 수정합니다. (/api/portfolio)
 * (GET과 마찬가지로 ID 없이 토큰 기반으로 수정한다고 추론)
 * @param data 수정할 내용 (name, description)
 * @returns 수정된 Portfolio 객체
 */
export async function updatePortfolio(
  data: UpdatePortfolioRequest
): Promise<Portfolio> {
  // PUT 엔드포인트는 스크린샷에 명시되지 않았으나, CRUD를 완성하기 위해 일반적인 경로로 작성합니다.
  const response = await instance.put<CommonResponse<Portfolio>>(
    "/api/portfolio",
    data
  );
  return response.data.data;
}

/**
 * [DELETE] 포트폴리오 정보를 삭제합니다. (/api/portfolio)
 * (DELETE 엔드포인트는 스크린샷에 명시되지 않았으나, 일반적인 경로로 작성합니다.)
 */
export async function deletePortfolio(): Promise<void> {
  await instance.delete("/api/portfolio");
}
