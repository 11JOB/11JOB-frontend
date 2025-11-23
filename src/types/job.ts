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

export interface Job {
  jobId: number;
  requestNo: string;
  companyName: string;
  title: string;
  workAddress: string;
  jobCodeName: string;
  academicName: string;
  careerName: string;
  registrationDate: string;
  expirationDate: string;
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
  content: Job[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ----------------------------------------------------
// 3. API 요청 파라미터 정의
// ----------------------------------------------------

export interface JobRequestParams {
  workLocation?: string;
  careerConditionName?: string;
  searchKeyword?: string;
  searchType?: string;
}

export interface PageableParams {
  page: number;
  size: number;
  sort?: string[];
}

export interface JobFilterParams {
  request: JobRequestParams;
  pageable: PageableParams;
}
