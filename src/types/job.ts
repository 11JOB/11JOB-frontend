// 공통 응답 구조
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

// ----------------------------------------------------
// 1. Job 객체 정의 (JSON 'content' 배열 요소 기반)
// ----------------------------------------------------

/** 채용 공고 상세 객체 */
export interface Job {
  jobId: number;
  requestNo: string;
  companyName: string;
  title: string;
  workAddress: string;
  jobCodeName: string;
  academicName: string; // 학력
  careerName: string; // 경력
  registrationDate: string; // "2025-11-16"
  expirationDate: string; // "2025-11-16"
  detailUrl: string;
}

// ----------------------------------------------------
// 2. 페이지네이션 객체 정의 (Spring Page 응답 구조 기반)
// ----------------------------------------------------

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  unpaged: boolean;
}

/** Job 목록 페이지네이션 응답 구조 (GET /api/jobs 응답 전체 구조) */
export interface JobPageResponse {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  size: number;
  content: Job[]; // 핵심 데이터 (Job 객체 배열)
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ----------------------------------------------------
// 3. 쿼리 파라미터 정의 (스크린샷 기반)
// ----------------------------------------------------

/** 채용 공고 조회 시 사용되는 쿼리 파라미터 (GET /api/jobs) */
export interface JobFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  type?: string;
  status?: string;
  keyword?: string;
}
