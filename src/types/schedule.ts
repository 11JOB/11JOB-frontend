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
// Schedule Detail and File Types
// ----------------------------------------------------

export interface ScheduleDetail {
  detailId: number;
  title: string;
  content: string;
}

export interface ScheduleFile {
  fileId: number;
  originalName: string;
  filePath: string;
}

// ----------------------------------------------------
// Schedule (일정) 관련 타입 - API 응답 구조에 맞춤
// ----------------------------------------------------

/** * 일정 객체 (API 응답/조회 구조)
 */
export interface Schedule {
  scheduleId: number;
  companyId: number;
  companyName: string;
  title: string;
  scheduleDate: string; // 일정 날짜 (YYYY-MM-DD)
  createdDate: string; // 생성일시 (ISO 8601)
  updatedDate: string; // 수정일시 (ISO 8601)
  details: ScheduleDetail[];
  files: ScheduleFile[];
}

/** * 일정 생성 DTO 요청 (FormData의 'dto' 필드에 JSON 문자열로 들어갈 구조)
 */
export interface CreateScheduleDto {
  title: string;
  scheduleDate: string; // YYYY-MM-DD
  companyName: string;
  details: {
    title: string;
    content: string;
  }[];
}

/** * 일정 수정 요청 (PUT /api/schedules/{scheduleId} 요청 Body)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateScheduleRequest extends CreateScheduleDto {
  // 수정 요청 시 필요한 추가 필드가 있다면 여기에 명시
}

/** * 일정 목록 조회 쿼리 파라미터 (GET /api/schedules 쿼리)
 */
export interface ScheduleFilterParams {
  page?: number;
  size?: number;
  sort?: string; // 정렬 기준
}
