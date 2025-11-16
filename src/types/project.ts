// 공통 응답 구조는 CommonResponse<T>를 사용합니다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

/** 프로젝트 객체 (GET /api/projects 응답 및 상세 구조) */
export interface Project {
  projectId: number;
  name: string;
  status: string; // 프로젝트 상태 (예: '진행 중', '완료' 등)
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

/** 프로젝트 생성 요청 (POST /api/projects 요청 Body) */
export interface CreateProjectRequest {
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

/** 프로젝트 수정 요청 (PUT /api/projects/{projectId} 요청 Body) */
export type UpdateProjectRequest = CreateProjectRequest;

/** 프로젝트 삭제 요청 (Path Parameter 방식 사용) */
// DeleteRequest 타입은 사용하지 않습니다.
