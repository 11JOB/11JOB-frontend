// src/api/schedule.ts
import instance from "./instance";
import {
  CommonResponse,
  Schedule,
  UpdateScheduleRequest,
  ScheduleFilterParams,
  CreateScheduleDto,
} from "../types/schedule";

/**
 * [POST] 새 일정을 추가합니다. (/api/schedules)
 * Request Body Type: multipart/form-data
 */
export async function createSchedule(
  dto: CreateScheduleDto,
  files: File[] = []
): Promise<Schedule> {
  const formData = new FormData();

  // dto JSON part
  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  // files parts (key must be "files")
  files.forEach((file) => formData.append("files", file));

  const response = await instance.post<CommonResponse<Schedule>>(
    "/api/schedules",
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
 * [GET] 일정 목록을 조회합니다. (/api/schedules)
 * 스웨거 기준: 응답은 CommonResponse 래핑이 아니라 Schedule 또는 Schedule[] 형태.
 */
export async function getScheduleList(
  params: ScheduleFilterParams = {}
): Promise<Schedule[]> {
  const response = await instance.get<Schedule[] | Schedule>("/api/schedules", {
    params,
  });

  const raw = response.data;

  // 응답이 배열인 경우 / 객체 한 개인 경우 둘 다 처리
  if (Array.isArray(raw)) {
    return raw;
  }
  return [raw];
}

/**
 * [GET] 특정 ID의 일정을 상세 조회합니다. (/api/schedules/{scheduleId})
 * 스웨거 기준: Schedule 그대로 반환 (래핑 없음)
 */
export async function getScheduleDetail(scheduleId: number): Promise<Schedule> {
  const response = await instance.get<Schedule>(`/api/schedules/${scheduleId}`);
  return response.data;
}

/**
 * [PUT] 특정 ID의 일정을 업데이트합니다. (/api/schedules/{scheduleId})
 * 스웨거 기준: Request Body Type: multipart/form-data (dto + files)
 */
export async function updateSchedule(
  scheduleId: number,
  dto: UpdateScheduleRequest,
  files: File[] = []
): Promise<void> {
  const formData = new FormData();

  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  files.forEach((file) => formData.append("files", file));

  await instance.put(`/api/schedules/${scheduleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * [DELETE] 특정 ID의 일정을 삭제합니다. (/api/schedules/{scheduleId})
 */
export async function deleteSchedule(scheduleId: number): Promise<void> {
  await instance.delete(`/api/schedules/${scheduleId}`);
}
