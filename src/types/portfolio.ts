// src/types/portfolio.ts

// 공통 응답 구조
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommonResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

export interface Portfolio {
  portfolioId: number;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CreatePortfolioRequest {
  phone: string;
  address: string;
  profileImage: string; // Base64 URL (미리보기/호환용)
  educations: {
    institutionName: string;
    startDate: string;
    endDate: string;
  }[];
  experiences: {
    institutionName: string;
    startDate: string;
    endDate: string;
  }[];
  activities: {
    institutionName: string;
    startDate: string;
    endDate: string;
  }[];
  links: {
    title: string;
    url: string;
  }[];
  certificates: {
    title: string;
    acquireDate: string;
  }[];
}

export type UpdatePortfolioRequest = CreatePortfolioRequest;

export interface PortfolioDetail {
  institutionName?: string;
  startDate?: string;
  endDate?: string;

  title?: string;
  url?: string;

  acquireDate?: string;
}

export interface PortfolioResponse {
  id: number;
  phone: string;
  address: string;
  profileImagePath: string;
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
