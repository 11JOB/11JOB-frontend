import instance from "./instance";
import {
  CommonResponse,
  Project,
  UpdateProjectRequest,
} from "../types/project";

/**
 * [POST] 새 프로젝트를 추가합니다. (/api/projects)
 */
export async function createProject(formData: FormData) {
  const response = await instance.post("/api/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

/**
 * [GET] 내 프로젝트 목록을 조회합니다. (/api/projects)
 * (목록 조회 시 페이지네이션 파라미터가 있을 수 있으나, 스크린샷에 명시된 쿼리는 없으므로 생략)
 */
export async function getProjectList(): Promise<Project[]> {
  const response = await instance.get<CommonResponse<Project[]>>(
    "/api/projects"
  );
  return response.data.data;
}

/**
 * [PUT] 특정 ID의 프로젝트를 업데이트합니다. (/api/projects/{projectId})
 */
export async function updateProject(
  projectId: number,
  data: UpdateProjectRequest
): Promise<Project> {
  const response = await instance.put<CommonResponse<Project>>(
    `/api/projects/${projectId}`,
    data
  );
  return response.data.data;
}

/**
 * [DELETE] 특정 ID의 프로젝트를 삭제합니다. (/api/projects/{projectId})
 */
export async function deleteProject(projectId: number): Promise<void> {
  await instance.delete(`/api/projects/${projectId}`);
}
