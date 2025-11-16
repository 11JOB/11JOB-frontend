import instance from "./instance";
import {
  CommonResponse,
  JobPageResponse,
  JobFilterParams,
  Job,
} from "../types/job";

/**
 * [GET] 필터링된 채용 공고 목록을 조회합니다. (/api/jobs)
 * * @param params 페이지네이션 및 필터링 쿼리 파라미터
 * @returns JobPageResponse 객체 (페이지 정보 및 Job[] 포함)
 */
export async function getFilteredJobList(
  params: JobFilterParams
): Promise<JobPageResponse> {
  // 실제 API는 CommonResponse<JobPageResponse> 형태로 감싸져 있을 가능성이 높습니다.
  const response = await instance.get<CommonResponse<JobPageResponse>>(
    "/jobs",
    {
      params,
    }
  );
  return response.data.data;
}

/**
 * (선택적) 목록 데이터만 필요한 경우, 데이터를 풀어서 반환하는 함수
 */
export async function getJobContent(params: JobFilterParams): Promise<Job[]> {
  const pageResponse = await getFilteredJobList(params);
  return pageResponse.content;
}
