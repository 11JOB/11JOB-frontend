// ----------------------------------------------------
// 공통 응답 구조
// ----------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

// ----------------------------------------------------
// Schedule (일정) 관련 타입
// ----------------------------------------------------

/** * 일정 객체 (GET /api/schedules/{scheduleId} 응답 구조에 보이는 모든 필드 포함)
 */
export interface Schedule {
  scheduleId: number;
  title: string;
  description: string;
  date: string; // 일정 날짜 (YYYY-MM-DD 형식으로 추론)
  status: string; // 일정 상태 (예: SCHEDULED, DONE 등)
  createdAt: string; // 생성일시
  modifiedAt: string; // 수정일시
}

/** * 일정 생성 요청 (POST /api/schedules 요청 Body)
 */
export interface CreateScheduleRequest {
  title: string;
  date: string;
  description: string;
}

/** * 일정 수정 요청 (PUT /api/schedules/{scheduleId} 요청 Body)
 */
export type UpdateScheduleRequest = CreateScheduleRequest;

/** * 일정 목록 조회 쿼리 파라미터 (GET /api/schedules 쿼리)
 */
export interface ScheduleFilterParams {
  page?: number;
  size?: number;
  sort?: string; // 정렬 기준
}
