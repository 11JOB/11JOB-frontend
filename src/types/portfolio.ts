// src/types/portfolio.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

// 공통 응답 구조
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

// POST /api/portfolio 응답으로 오는 포트폴리오(백엔드 정의에 맞춰 사용)
export interface Portfolio {
  portfolioId: number;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

/** ---------- dto 내부 필드 타입들 ---------- */

export interface EducationDto {
  institutionName: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceDto {
  institutionName: string;
  startDate: string;
  endDate: string;
}

export interface ActivityDto {
  institutionName: string;
  startDate: string;
  endDate: string;
}

export interface LinkDto {
  title: string;
  url: string;
}

export interface CertificateDto {
  title: string;
  acquireDate: string;
}

/**
 * POST /api/portfolio, PUT /api/portfolio 의 dto 구조
 *  - 프로필 이미지는 여기 포함 X (multipart의 profileImage 파트로 보냄)
 */
export interface CreatePortfolioRequest {
  phone: string;
  address: string;
  educations: EducationDto[];
  experiences: ExperienceDto[];
  activities: ActivityDto[];
  links: LinkDto[];
  certificates: CertificateDto[];
}

export type UpdatePortfolioRequest = CreatePortfolioRequest;

/** ---------- GET /api/portfolio 응답 구조 ---------- */

export interface PortfolioDetail {
  institutionName?: string;
  startDate?: string;
  endDate?: string;

  title?: string;
  url?: string;

  acquireDate?: string;
}

export interface PortfolioResponse {
  profileImageUrl: string;
  id: number;
  phone: string;
  address: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  educations: PortfolioDetail[];
  experiences: PortfolioDetail[];
  activities: PortfolioDetail[];
  links: PortfolioDetail[];
  certificates: PortfolioDetail[];
}
