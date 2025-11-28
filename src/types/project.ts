// src/types/project.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

export interface ProjectResponse {
  id: number;
  title: string | null;
  description: string;
  startDate: string;
  endDate: string;
  linkUrl: string | null;
  imageUrl: string | null;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  linkUrl: string;
}

export type UpdateProjectRequest = CreateProjectRequest;
