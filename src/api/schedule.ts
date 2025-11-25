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
