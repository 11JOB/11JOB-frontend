// src/api/project.ts
import instance from "./instance";
import { CommonResponse, ProjectResponse } from "../types/project";

/**
 * [POST] 새 프로젝트를 추가합니다. (/api/projects)
 * Request: multipart/form-data
 *  - dto: application/json (CreateProjectRequest)
 *  - image: file (optional)
 */
export async function createProject(
  formData: FormData
): Promise<ProjectResponse> {
  const response = await instance.post<CommonResponse<ProjectResponse>>(
    "/api/projects",
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
 * [GET] 내 프로젝트 목록을 조회합니다. (/api/projects)
 */
export async function getProjectList(): Promise<ProjectResponse[]> {
  const response = await instance.get("/api/projects");
  const data = response.data;

  // 1) 배열로 바로 오는 경우
  if (Array.isArray(data)) {
    return data;
  }

  // 3) 그 외에는 빈 배열
  return [];
}

/**
 * [PUT] 특정 ID의 프로젝트를 업데이트합니다. (/api/projects/{projectId})
 * Request: POST와 동일하게 multipart/form-data(dto + image)
 */
export async function updateProject(
  projectId: number,
  formData: FormData
): Promise<ProjectResponse> {
  const response = await instance.put<CommonResponse<ProjectResponse>>(
    `/api/projects/${projectId}`,
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
 * [DELETE] 특정 ID의 프로젝트를 삭제합니다. (/api/projects/{projectId})
 */
export async function deleteProject(projectId: number): Promise<void> {
  await instance.delete(`/api/projects/${projectId}`);
}
