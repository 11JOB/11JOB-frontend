// src/api/project.ts
import instance from "./instance";
import { CommonResponse, Project } from "../types/project";

/**
 * [POST] 새 프로젝트를 추가합니다. (/api/projects)
 * Request: multipart/form-data
 *  - dto: application/json (CreateProjectRequest)
 *  - image: file (optional)
 */
export async function createProject(formData: FormData): Promise<Project> {
  const response = await instance.post<CommonResponse<Project>>(
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
export async function getProjectList(): Promise<Project[]> {
  const response = await instance.get<CommonResponse<Project[]>>(
    "/api/projects"
  );
  return response.data.data;
}

/**
 * [PUT] 특정 ID의 프로젝트를 업데이트합니다. (/api/projects/{projectId})
 * Request: POST와 동일하게 multipart/form-data(dto + image)
 */
export async function updateProject(
  projectId: number,
  formData: FormData
): Promise<Project> {
  const response = await instance.put<CommonResponse<Project>>(
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
