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

// 타입 가드
const isEducationCareer = (item: any) =>
  item.institutionName && item.startDate && item.endDate;

const isLinkItem = (item: any) => item.title && item.url;

const isCertificate = (item: any) => item.title && item.acquireDate;

// 카드 컴포넌트
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
  }

  return <div className={cardStyle}>{content}</div>;
};

export default function PortfolioView() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 최초 로드: API 조회
  useEffect(() => {
    async function load() {
      try {
        const res = await getPortfolio();
        setPortfolio(res);
      } catch (e) {
        console.error("포트폴리오 조회 실패", e);
      }
    }
    load();
  }, []);

  // ✅ useMemo를 무조건 호출 (조건 분기 안에 넣지 않기!)
  const filtered = useMemo(() => {
    // portfolio 없으면 null 그대로 반환해서 아래 렌더에서 로딩 처리
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

  // ✅ 로딩 처리는 Hook 호출 "아래"에서
  if (!portfolio || !filtered) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
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
                    src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${portfolio.profileImagePath}`}
                    alt="프로필"
                    className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
                  />

                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {portfolio.user.name}
                  </h2>

                  <p className="text-sm text-teal-600 mt-1 font-medium">
                    Frontend Developer
                  </p>
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
                  <Search className="text-gray-400 absolute left-3" size={20} />
                  <input
                    type="text"
                    placeholder="검색 (예: React, 2024, 회사명)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-2 text-gray-500"
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
  );
}

// 공통 섹션 컴포넌트
function Section({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: any[];
}) {
  return (
    <div className="mb-10 p-6 bg-gray-50 rounded-2xl border shadow-inner">
      <div className="flex items-center pb-3 mb-4 border-b-2 border-teal-300">
        <Icon size={28} className="mr-3 text-teal-600" />
        <h2 className="text-2xl font-bold">{title}</h2>
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
