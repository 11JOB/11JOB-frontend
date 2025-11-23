// src/types/schedule.ts

// ✅ 리스트에서 registration으로 넘길 최소 구조
export interface SelectedJob {
  jobId: number;
  companyName: string;
  title: string;
  expirationDate: string; // "yyyy-MM-dd"
}

// ✅ Swagger POST /api/schedules dto 구조 그대로
export interface CreateScheduleDto {
  companyName: string;
  title: string;
  scheduleDate: string; // "yyyy-MM-dd"
  details: {
    detailId?: number; // 생성 시 optional
    title: string;
    content: string;
  }[];
  filesToDelete: number[];
}

// ✅ 공통 응답
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

// ✅ 응답 Schedule 타입
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

export interface Schedule {
  scheduleId: number;
  companyId: number;
  companyName: string;
  title: string;
  scheduleDate: string;
  createdDate: string;
  updatedDate: string;
  details: ScheduleDetail[];
  files: ScheduleFile[];
}

export interface ScheduleFilterParams {
  page?: number;
  size?: number;
  sort?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateScheduleRequest extends CreateScheduleDto {}
