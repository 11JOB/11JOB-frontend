// src/api/schedule.ts
import instance from "./instance";
import {
  CommonResponse,
  Schedule,
  UpdateScheduleRequest,
  ScheduleFilterParams,
} from "../types/schedule";

/**
 * [POST] 새 일정을 추가합니다. (/api/schedules)
 * Request Body Type: multipart/form-data
 */
export async function createSchedule(data: FormData): Promise<Schedule> {
  const response = await instance.post<CommonResponse<Schedule>>(
    "/api/schedules",
    data
  );
  return response.data.data;
}

/**
 * [GET] 일정 목록을 조회합니다. (/api/schedules)
 */
export async function getScheduleList(
  params: ScheduleFilterParams = {}
): Promise<Schedule[]> {
  const response = await instance.get<CommonResponse<Schedule[]>>(
    "/api/schedules",
    { params }
  );
  return response.data.data;
}

/**
 * [GET] 특정 ID의 일정을 상세 조회합니다. (/api/schedules/{scheduleId})
 */
export async function getScheduleDetail(scheduleId: number): Promise<Schedule> {
  const response = await instance.get<CommonResponse<Schedule>>(
    `/api/schedules/${scheduleId}`
  );
  return response.data.data;
}

/**
 * [PUT] 특정 ID의 일정을 업데이트합니다. (/api/schedules/{scheduleId})
 */
export async function updateSchedule(
  scheduleId: number,
  data: UpdateScheduleRequest
): Promise<Schedule> {
  const response = await instance.put<CommonResponse<Schedule>>(
    `/api/schedules/${scheduleId}`,
    data
  );
  return response.data.data;
}

/**
 * [DELETE] 특정 ID의 일정을 삭제합니다. (/api/schedules/{scheduleId})
 */
export async function deleteSchedule(scheduleId: number): Promise<void> {
  await instance.delete(`/api/schedules/${scheduleId}`);
}
