/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Zap,
  ClipboardList,
  Link,
  X,
  Calendar,
} from "lucide-react";

// --- 1. 타입 정의 ---

// 1.1. 개인 정보 상태 타입
interface ProfileState {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string | null;
}

// 1.2. 동적 항목 기본 타입 (모든 동적 항목이 가질 수 있는 필드)
interface BaseDetailItem {
  id: number;
  institution?: string; // 기관/회사명
  title?: string; // 자격증/자소서 제목
  detail?: string; // 상세 내용 (추가)
}

// 1.3. 동적 항목별 상세 타입
interface EducationCareerActivity extends BaseDetailItem {
  institution: string;
  entryDate: string; // YYYY-MM
  exitDate: string | "재직 중"; // YYYY-MM
  title?: never;
  detail: string;
}

interface Introduction extends BaseDetailItem {
  title: string;
  link: string;
  institution?: never;
  detail?: never;
}

interface Certification extends BaseDetailItem {
  title: string;
  acquisitionDate: string; // YYYY-MM-DD
  institution?: never;
  detail?: never;
}

type DetailItem = EducationCareerActivity | Introduction | Certification;

// 1.4. 포트폴리오 섹션 타입
interface PortfolioSection {
  title: string;
  icon: React.ElementType; // Lucide Icon Type
  items: DetailItem[];
}

// 1.5. 타입 가드 함수
const isEducationCareerActivity = (
  item: DetailItem
): item is EducationCareerActivity => {
  return (item as EducationCareerActivity).institution !== undefined;
};

const isIntroduction = (item: DetailItem): item is Introduction => {
  return (item as Introduction).link !== undefined;
};

const isCertification = (item: DetailItem): item is Certification => {
  return (item as Certification).acquisitionDate !== undefined;
};

// --- 2. 목업 데이터 ---
const mockProfile: ProfileState = {
  name: "김세종",
  email: "sejong.kim@example.com",
  phone: "010-5678-5678",
  address: "서울특별시 광진구 군자로 121",
  profileImage: "https://placehold.co/150x150/00796B/FFFFFF?text=Sejong",
};

const mockPortfolio: PortfolioSection[] = [
  {
    title: "학력 및 교육 이력",
    icon: BookOpen,
    items: [
      {
        id: 1,
        institution: "세종대학교",
        entryDate: "2019-03",
        exitDate: "2023-02",
        detail: "컴퓨터공학과 학사 졸업 (평점 4.0/4.5)",
      } as EducationCareerActivity,
      {
        id: 2,
        institution: "ABC IT 교육센터",
        entryDate: "2023-03",
        exitDate: "2023-08",
        detail: "웹 개발 부트캠프 수료 (6개월)",
      } as EducationCareerActivity,
    ],
  },
  {
    title: "경력",
    icon: Briefcase,
    items: [
      {
        id: 3,
        institution: "Innovatech Solutions",
        entryDate: "2023-09",
        exitDate: "재직 중",
        detail: "프론트엔드 개발자 (React, Next.js)",
      } as EducationCareerActivity,
    ],
  },
  {
    title: "주요 활동 (프로젝트)",
    icon: Zap,
    items: [
      {
        id: 4,
        institution: "개인 프로젝트: 포트폴리오 웹 서비스",
        entryDate: "2024-01",
        exitDate: "2024-06",
        detail:
          "Full-stack 개발. Firebase와 Tailwind CSS 사용. 현재 서비스 운영 중.",
      } as EducationCareerActivity,
      {
        id: 5,
        institution: "팀 프로젝트: AI 기반 이미지 인식",
        entryDate: "2022-09",
        exitDate: "2022-12",
        detail: "ResNet 모델 기반으로 이미지 분류 프로젝트 수행.",
      } as EducationCareerActivity,
    ],
  },
  {
    title: "자기소개서 (링크)",
    icon: Link,
    items: [
      {
        id: 6,
        title: "2024년 상반기 지원 자기소개서",
        link: "https://link.to/my/intro1",
      } as Introduction,
      {
        id: 7,
        title: "기술 블로그 (개발 경험 정리)",
        link: "https://sejong.dev/blog",
      } as Introduction,
    ],
  },
  {
    title: "자격증 및 스킬",
    icon: ClipboardList,
    items: [
      {
        id: 8,
        title: "정보처리기사",
        acquisitionDate: "2023-05-15",
      } as Certification,
      {
        id: 9,
        title: "TOEIC 950",
        acquisitionDate: "2022-11-01",
      } as Certification,
    ],
  },
];

// --- 3. 서브 컴포넌트: 아이템 렌더링 ---

const DetailItemCard: React.FC<{ item: DetailItem }> = ({ item }) => {
  let content;
  let cardStyle =
    "p-4 rounded-xl mb-4 transition-all duration-300 hover:shadow-md";

  if (isEducationCareerActivity(item)) {
    // 학력/경력/활동 (Timeline Style)
    cardStyle += " bg-white border border-gray-200 shadow-sm";
    content = (
      <>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 break-words pr-2">
            {item.institution}
          </h3>
          <div className="flex items-center text-sm text-gray-500 font-medium whitespace-nowrap bg-teal-50 p-1 px-2 rounded-full">
            <Calendar size={14} className="mr-1 text-teal-600" />
            {item.entryDate} ~ {item.exitDate}
          </div>
        </div>
        <p className="text-gray-700 whitespace-pre-line text-base">
          {item.detail}
        </p>
      </>
    );
  } else if (isIntroduction(item)) {
    // 자기소개서/링크 (Link Style)
    cardStyle +=
      " bg-blue-50 border border-blue-200 hover:bg-blue-100 shadow-sm";
    content = (
      <>
        <h3 className="text-lg font-semibold text-blue-700">{item.title}</h3>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center mt-1"
        >
          <Link size={16} className="mr-1 text-blue-500" />
          <span className="truncate">{item.link}</span>
        </a>
      </>
    );
  } else if (isCertification(item)) {
    // 자격증/스킬 (Badge Style)
    cardStyle += " bg-teal-50 border border-teal-200 shadow-sm";
    content = (
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-teal-800">{item.title}</h3>
        <div className="text-xs text-teal-600 bg-teal-100 py-1 px-3 rounded-full font-medium whitespace-nowrap">
          {item.acquisitionDate}
        </div>
      </div>
    );
  } else {
    cardStyle += " bg-red-100 border border-red-300";
    content = <p className="text-red-600">알 수 없는 항목 유형입니다.</p>;
  }

  return <div className={cardStyle}>{content}</div>;
};

// --- 4. 메인 컴포넌트 ---
export default function PortfolioView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profile] = useState<ProfileState>(mockProfile);

  // 검색어를 포함하는 항목만 필터링하는 로직
  const filteredPortfolio = useMemo(() => {
    if (!searchTerm) {
      return mockPortfolio; // 검색어가 없으면 전체 포트폴리오 반환
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return mockPortfolio
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          // 1. EducationCareerActivity 타입 항목 검색 (institution, detail, dates)
          if (isEducationCareerActivity(item)) {
            const institutionMatch =
              item.institution &&
              item.institution.toLowerCase().includes(lowerSearchTerm);
            const detailMatch =
              item.detail &&
              item.detail.toLowerCase().includes(lowerSearchTerm);
            const dateMatch =
              item.entryDate.includes(lowerSearchTerm) ||
              item.exitDate.includes(lowerSearchTerm);

            return institutionMatch || detailMatch || dateMatch;
          }

          // 2. Introduction 타입 항목 검색 (title, link)
          if (isIntroduction(item)) {
            const titleMatch =
              item.title && item.title.toLowerCase().includes(lowerSearchTerm);
            const linkMatch =
              item.link && item.link.toLowerCase().includes(lowerSearchTerm);
            return titleMatch || linkMatch;
          }

          // 3. Certification 타입 항목 검색 (title, date)
          if (isCertification(item)) {
            const titleMatch =
              item.title && item.title.toLowerCase().includes(lowerSearchTerm);
            const dateMatch = item.acquisitionDate.includes(lowerSearchTerm);
            return titleMatch || dateMatch;
          }

          return false;
        }),
      }))
      .filter((section) => section.items.length > 0); // 항목이 하나라도 있는 섹션만 남김
  }, [searchTerm]);

  return (
    // 배경색 및 최소 높이 설정
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            김세종 님의 포트폴리오
          </h1>
          <p className="text-xl text-gray-500">
            취업 및 프로젝트 진행을 위한 상세 이력
          </p>
        </div>

        {/* 메인 레이아웃 (반응형: 모바일은 1단, 데스크탑은 2단) */}
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* 좌측: 개인 정보 (md 이상에서 sticky) */}
          <div className="md:col-span-1 mb-8 md:mb-0">
            <div className="sticky top-8">
              {/* 개인 정보 카드 */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500">
                <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                  <img
                    src={
                      profile.profileImage ||
                      "https://placehold.co/120x120/CCCCCC/333333?text=Profile"
                    }
                    alt="프로필 이미지"
                    className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-teal-600 mt-1 font-medium">
                    프론트엔드 개발자
                  </p>
                </div>

                {/* 연락처 정보 */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-700 text-sm">
                    <Mail
                      size={18}
                      className="mr-3 text-teal-500 flex-shrink-0"
                    />{" "}
                    {profile.email}
                  </div>
                  <div className="flex items-center text-gray-700 text-sm">
                    <Phone
                      size={18}
                      className="mr-3 text-teal-500 flex-shrink-0"
                    />{" "}
                    {profile.phone}
                  </div>
                  <div className="flex items-start text-gray-700 text-sm">
                    <MapPin
                      size={18}
                      className="mr-3 text-teal-500 flex-shrink-0 mt-0.5"
                    />{" "}
                    {profile.address}
                  </div>
                </div>
              </div>

              {/* 검색창을 좌측에 배치 */}
              <div className="mt-6 p-4 bg-white rounded-2xl shadow-md border border-gray-200">
                <div className="flex items-center relative">
                  <Search className="text-gray-400 absolute left-3" size={20} />
                  <input
                    type="text"
                    placeholder="전체 항목 검색 (예: React, 세종)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-gray-700 outline-none rounded-lg focus:ring-2 focus:ring-teal-400 border border-gray-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 p-1 text-gray-500 hover:text-gray-700"
                      aria-label="검색어 초기화"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 상세 포트폴리오 섹션 */}
          <div className="md:col-span-2">
            {filteredPortfolio.length === 0 && searchTerm ? (
              <div className="text-center p-12 bg-white rounded-2xl shadow-lg text-gray-500 border-2 border-dashed border-gray-300">
                <Search size={30} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-semibold">검색 결과가 없습니다.</p>
                <p>
                  <span className="font-medium text-teal-600">
                    &apos;{searchTerm}&lsquo;
                  </span>
                  에 해당하는 내용을 찾을 수 없습니다.
                </p>
              </div>
            ) : (
              // 포트폴리오 섹션 리스트
              filteredPortfolio.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.title}
                    className="mb-10 p-6 bg-gray-50 rounded-2xl shadow-inner border border-gray-200"
                  >
                    {/* 섹션 제목 */}
                    <div className="flex items-center pb-3 mb-4 border-b-2 border-teal-300">
                      <Icon size={28} className="mr-3 text-teal-600" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        {section.title}
                      </h2>
                    </div>
                    {/* 섹션 항목 */}
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <DetailItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
