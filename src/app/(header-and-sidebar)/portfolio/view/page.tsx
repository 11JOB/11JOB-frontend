// app/portfolio/view/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Zap,
  ClipboardList,
  Link as LinkIcon,
  X,
  Calendar,
} from "lucide-react";

import { getPortfolio } from "@/api/portfolio";
import type { PortfolioResponse } from "@/types/portfolio";

import { getProjectList } from "@/api/project";
import type { ProjectResponse } from "@/types/project";

// ⭐ 포트폴리오 없을 때 보여줄 컴포넌트
import EmptyPortfolioState from "../registration/empty-portfolio-state"; // 경로는 구조에 맞게 수정

// ===============================
// 타입 가드
// ===============================
const isEducationCareer = (item: any) =>
  item.institutionName && item.startDate && item.endDate;

const isLinkItem = (item: any) => item.title && item.url;

const isCertificate = (item: any) => item.title && item.acquireDate;

// ===============================
// 공통 상세 카드
// ===============================
const DetailItemCard = ({ item }: { item: any }) => {
  let content;
  let cardStyle =
    "p-4 rounded-xl mb-4 transition-all duration-300 hover:shadow-md";

  if (isEducationCareer(item)) {
    content = (
      <>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">
            {item.institutionName}
          </h3>
          <div className="flex items-center text-sm text-gray-500 font-medium bg-teal-50 p-1 px-2 rounded-full">
            <Calendar size={14} className="mr-1 text-teal-600" />
            {item.startDate} ~ {item.endDate}
          </div>
        </div>
      </>
    );
    cardStyle += " bg-white border border-gray-200 shadow-sm";
  } else if (isLinkItem(item)) {
    content = (
      <>
        <h3 className="text-lg font-semibold text-blue-700">{item.title}</h3>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 flex items-center mt-1"
        >
          <LinkIcon size={16} className="mr-1" />
          {item.url}
        </a>
      </>
    );
    cardStyle += " bg-blue-50 border border-blue-200";
  } else if (isCertificate(item)) {
    content = (
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-teal-800">{item.title}</h3>
        <div className="text-xs text-teal-600 bg-teal-100 py-1 px-3 rounded-full">
          {item.acquireDate}
        </div>
      </div>
    );
    cardStyle += " bg-teal-50 border border-teal-200";
  } else {
    // 활동/기타 기본 카드
    content = (
      <>
        <h3 className="text-lg font-semibold text-gray-900">
          {item.title ?? "제목 없음"}
        </h3>
        {item.description && (
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
            {item.description}
          </p>
        )}
      </>
    );
    cardStyle += " bg-white border border-gray-200 shadow-sm";
  }

  return <div className={cardStyle}>{content}</div>;
};

// ===============================
// 🔥 프로젝트 목록 모달 (조회 전용)
// ===============================
const ProjectListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getProjectList();
        setProjects(list ?? []);
      } catch (e) {
        console.error("프로젝트 목록 조회 실패:", e);
        setError("프로젝트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Zap className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">
              프로젝트 상세 목록
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          {loading && (
            <div className="py-10 text-center text-gray-500">
              프로젝트를 불러오는 중입니다...
            </div>
          )}

          {error && (
            <div className="py-4 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              등록된 프로젝트가 없습니다.
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  {/* 이미지 */}
                  {project.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={project.imageUrl}
                        alt={project.title ?? "프로젝트 이미지"}
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* 제목 + 기간 */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.title ?? "제목 없음"}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      <Calendar size={12} className="mr-1" />
                      {project.startDate} ~ {project.endDate}
                    </div>
                  </div>

                  {/* 설명 */}
                  {project.description && (
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                      {project.description}
                    </p>
                  )}

                  {/* 링크 */}
                  {project.linkUrl && (
                    <a
                      href={project.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-indigo-600 hover:underline"
                    >
                      <LinkIcon size={14} className="mr-1" />
                      프로젝트 링크 열기
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===============================
// 메인 포트폴리오 조회 컴포넌트
// ===============================
export default function PortfolioView() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // ⭐ 로딩/상태 관리
  const [status, setStatus] = useState<
    "loading" | "success" | "empty" | "error"
  >("loading");

  // 최초 로드: API 조회
  useEffect(() => {
    async function load() {
      try {
        const res = await getPortfolio();
        setPortfolio(res);
        setStatus("success");
      } catch (e: any) {
        console.error("포트폴리오 조회 실패", e);

        // ⭐ 404면 포트폴리오 없음 상태로 처리
        const statusCode = e?.response?.status ?? e?.status;
        if (statusCode === 404) {
          setStatus("empty");
          setPortfolio(null);
        } else {
          setStatus("error");
        }
      }
    }
    load();
  }, []);

  // 검색 필터링
  const filtered = useMemo(() => {
    if (!portfolio) return null;

    if (!searchTerm) return portfolio;

    const term = searchTerm.toLowerCase();

    const filterSection = (items: any[]) =>
      items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));

    return {
      ...portfolio,
      educations: filterSection(portfolio.educations),
      experiences: filterSection(portfolio.experiences),
      activities: filterSection(portfolio.activities),
      links: filterSection(portfolio.links),
      certificates: filterSection(portfolio.certificates),
    };
  }, [searchTerm, portfolio]);

  // ================= 상태별 분기 =================

  // 1) 로딩 중
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        로딩 중...
      </div>
    );
  }

  // 2) 포트폴리오가 아예 없을 때 (백엔드 404)
  if (status === "empty") {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <EmptyPortfolioState />
      </div>
    );
  }

  // 3) 기타 에러
  if (status === "error" && !portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen  gap-4">
        <p className="text-sm text-gray-500">
          포트폴리오를 불러오는 중 오류가 발생했습니다.
        </p>
        <EmptyPortfolioState />
      </div>
    );
  }

  // 4) 혹시 모를 안전장치
  if (!portfolio || !filtered) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        로딩 중...
      </div>
    );
  }

  // ================= 실제 뷰 렌더 =================
  return (
    <>
      <div className="p-4 md:p-8 min-h-screen font-sans">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {portfolio.user.name} 님의 포트폴리오
            </h1>
            <p className="text-xl text-gray-500">
              취업 및 프로젝트 진행을 위한 상세 이력
            </p>
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-8">
            {/* 좌측 - 프로필 */}
            <div className="md:col-span-1 mb-8 md:mb-0">
              <div className="sticky top-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500">
                  <div className="flex flex-col items-center pb-4 border-b">
                    <img
                      src={portfolio.profileImageUrl}
                      alt="프로필"
                      className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
                    />

                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                      {portfolio.user.name}
                    </h2>
                  </div>

                  {/* 연락처 */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Mail className="mr-3 text-teal-500" />{" "}
                      {portfolio.user.email}
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Phone className="mr-3 text-teal-500" /> {portfolio.phone}
                    </div>
                    <div className="flex items-start text-gray-700 text-sm">
                      <MapPin className="mr-3 text-teal-500 mt-0.5" />
                      {portfolio.address}
                    </div>
                  </div>
                </div>

                {/* 검색창 */}
                <div className="mt-6 p-4 bg-white rounded-2xl shadow-md border">
                  <div className="relative">
                    <Search
                      className="text-gray-400 absolute left-3 top-2.5"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="검색 (예: React, 2024, 회사명)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border rounded-lg"
                    />
                    {searchTerm && (
                      <button
                        className="absolute right-3 top-2.5 text-gray-500"
                        onClick={() => setSearchTerm("")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 - 상세 섹션 */}
            <div className="md:col-span-2">
              <Section
                title="학력 및 교육"
                icon={BookOpen}
                items={filtered.educations}
              />
              <Section
                title="경력"
                icon={Briefcase}
                items={filtered.experiences}
              />
              <Section
                title="활동 / 프로젝트"
                icon={Zap}
                items={filtered.activities}
                showProjectViewButton
                onClickProjectView={() => setIsProjectModalOpen(true)}
              />
              <Section
                title="자기소개서 / 링크"
                icon={LinkIcon}
                items={filtered.links}
              />
              <Section
                title="자격증"
                icon={ClipboardList}
                items={filtered.certificates}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 프로젝트 상세 조회 모달 */}
      <ProjectListModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
}

// ===============================
// 공통 섹션 컴포넌트
// ===============================
function Section({
  title,
  icon: Icon,
  items,
  showProjectViewButton = false,
  onClickProjectView,
}: {
  title: string;
  icon: any;
  items: any[];
  showProjectViewButton?: boolean;
  onClickProjectView?: () => void;
}) {
  return (
    <div className="mb-10 p-6 bg-gray-50 rounded-2xl border shadow-inner">
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-teal-300">
        <div className="flex items-center">
          <Icon size={28} className="mr-3 text-teal-600" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {showProjectViewButton && onClickProjectView && (
          <button
            type="button"
            onClick={onClickProjectView}
            className="px-3 py-1 text-xs font-semibold rounded-full border border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            프로젝트 자세히 보기
          </button>
        )}
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500">등록된 내용이 없습니다.</p>
        ) : (
          items.map((i, idx) => <DetailItemCard key={idx} item={i} />)
        )}
      </div>
    </div>
  );
}
