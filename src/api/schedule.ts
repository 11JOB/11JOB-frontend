import instance from "./instance";
import {
  CommonResponse,
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleFilterParams,
} from "../types/schedule"; // 타입 파일 경로 조정 필요

/**
 * [POST] 새 일정을 추가합니다. (/api/schedules)
 */
export async function createSchedule(
  data: CreateScheduleRequest
): Promise<Schedule> {
  const response = await instance.post<CommonResponse<Schedule>>(
    "/schedules",
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
    "/schedules",
    {
      params, // 쿼리 파라미터 적용
    }
  );
  return response.data.data;
}

/**
 * [GET] 특정 ID의 일정을 상세 조회합니다. (/api/schedules/{scheduleId})
 */
export async function getScheduleDetail(scheduleId: number): Promise<Schedule> {
  const response = await instance.get<CommonResponse<Schedule>>(
    `/schedules/${scheduleId}`
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
    `/schedules/${scheduleId}`,
    data
  );
  return response.data.data;
}

/**
 * [DELETE] 특정 ID의 일정을 삭제합니다. (/api/schedules/{scheduleId})
 */
export async function deleteSchedule(scheduleId: number): Promise<void> {
  await instance.delete(`/schedules/${scheduleId}`);
}
