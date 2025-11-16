// 공통 응답 구조
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

/** 포트폴리오 객체 (GET /api/portfolio 응답 구조) */
export interface Portfolio {
  portfolioId: number;
  name: string; // 포트폴리오 이름
  description: string; // 포트폴리오 설명
  createdAt: string;
  modifiedAt: string;
}

/** 포트폴리오 생성 요청 (POST /api/portfolio 요청 Body) */
export interface CreatePortfolioRequest {
  name: string;
  description: string;
}

/** 포트폴리오 수정 요청 (PUT /api/portfolio 요청 Body)
 * PUT 요청이 있다면 CreateRequest와 동일한 구조일 가능성이 높습니다.
 * (현재 스크린샷에 PUT은 없으므로 POST 구조와 동일하게 추론합니다.)
 */
export type UpdatePortfolioRequest = CreatePortfolioRequest;
