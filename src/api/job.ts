import instance from "./instance";
import { JobPageResponse, JobFilterParams } from "../types/job";

export async function getFilteredJobList(
  params: JobFilterParams
): Promise<JobPageResponse> {
  const req = params.request;
  const pageable = params.pageable;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: Record<string, any> = {};

  // 🔥 request → 플랫 쿼리로 변환 (요구사항 반영)
  if (req.workLocation) queryParams["workLocation"] = req.workLocation;
  if (req.careerConditionName)
    queryParams["careerConditionName"] = req.careerConditionName;
  if (req.searchKeyword) queryParams["searchKeyword"] = req.searchKeyword;
  if (req.searchType) queryParams["searchType"] = req.searchType;

  // 🔥 pageable → 플랫 쿼리로 변환
  queryParams["page"] = pageable.page;
  queryParams["size"] = pageable.size;

  if (pageable.sort) queryParams["sort"] = pageable.sort;

  // 🔥 서버는 PageResponse를 그대로 반환
  const response = await instance.get<JobPageResponse>("/api/jobs", {
    params: queryParams,
  });

  return response.data;
}

/**
 * 검색 헬퍼
 */
export async function getJobContent(options?: {
  keyword?: string;
  page?: number;
  size?: number;
  workLocation?: string;
  careerConditionName?: string;
  searchType?: string;
}): Promise<JobPageResponse> {
  return getFilteredJobList({
    request: {
      searchKeyword: options?.keyword || undefined,
      workLocation: options?.workLocation || undefined,
      careerConditionName: options?.careerConditionName || undefined,
      searchType: options?.searchType || undefined,
    },
    pageable: {
      page: options?.page ?? 0,
      size: options?.size ?? 10,
      sort: [`registrationDate,desc`],
    },
  });
}
