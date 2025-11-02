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
} from "lucide-react";

// --- 1. 타입 정의 (등록 페이지와 일치시킴) ---

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
  detail: string; // 조회 페이지에서는 detail을 필수로 가정
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

// 1.5. 타입 가드 함수 (검색 로직을 위해 필요)
// item이 EducationCareerActivity (학력/경력/활동) 타입인지 확인
const isEducationCareerActivity = (
  item: DetailItem
): item is EducationCareerActivity => {
  return (item as EducationCareerActivity).institution !== undefined;
};

// item이 Introduction (자기소개서 링크) 타입인지 확인
const isIntroduction = (item: DetailItem): item is Introduction => {
  return (item as Introduction).link !== undefined;
};

// item이 Certification (자격증/스킬) 타입인지 확인
const isCertification = (item: DetailItem): item is Certification => {
  return (item as Certification).acquisitionDate !== undefined;
};

// --- 2. 목업 데이터 ---
const mockProfile: ProfileState = {
  name: "김세종",
  email: "sejong.kim@example.com",
  phone: "010-5678-5678",
  address: "서울특별시 광진구 군자로 121",
  profileImage: "https://placehold.co/150x150/0000FF/FFFFFF?text=Sejong",
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

  if (isEducationCareerActivity(item)) {
    // 학력/경력/활동
    content = (
      <>
        <h3 className="text-lg font-semibold text-gray-800">
          {item.institution}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {item.entryDate} ~ {item.exitDate}
        </p>
        <p className="text-gray-700 whitespace-pre-line">{item.detail}</p>
      </>
    );
  } else if (isIntroduction(item)) {
    // 자기소개서/링크
    content = (
      <>
        <h3 className="text-lg font-semibold text-blue-600 hover:underline">
          {item.title}
        </h3>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
        >
          {item.link}
        </a>
      </>
    );
  } else if (isCertification(item)) {
    // 자격증/스킬
    content = (
      <>
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500">취득일: {item.acquisitionDate}</p>
      </>
    );
  } else {
    content = <p className="text-red-500">알 수 없는 항목 유형입니다.</p>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-inner mb-3 border border-gray-200">
      {content}
    </div>
  );
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
          // 1. EducationCareerActivity 타입 항목 검색 (institution, detail)
          if (isEducationCareerActivity(item)) {
            const institutionMatch =
              item.institution &&
              item.institution.toLowerCase().includes(lowerSearchTerm);
            const detailMatch =
              item.detail &&
              item.detail.toLowerCase().includes(lowerSearchTerm);
            return institutionMatch || detailMatch;
          }

          // 2. Introduction 타입 항목 검색 (title, link)
          if (isIntroduction(item)) {
            const titleMatch =
              item.title && item.title.toLowerCase().includes(lowerSearchTerm);
            const linkMatch =
              item.link && item.link.toLowerCase().includes(lowerSearchTerm);
            return titleMatch || linkMatch;
          }

          // 3. Certification 타입 항목 검색 (title)
          if (isCertification(item)) {
            const titleMatch =
              item.title && item.title.toLowerCase().includes(lowerSearchTerm);
            return titleMatch;
          }

          return false;
        }),
      }))
      .filter((section) => section.items.length > 0); // 항목이 하나라도 있는 섹션만 남김
  }, [searchTerm]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          포트폴리오 조회
        </h1>
        <p className="text-gray-500 mb-8">
          <span className="font-bold">{profile.name}</span> 님의
          포트폴리오입니다.
        </p>

        {/* 검색창 */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="포트폴리오 내용을 검색하세요 (예: React, 세종대학교)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 text-gray-700 outline-none"
          />
        </div>

        {/* 1. 개인 정보 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={
                profile.profileImage ||
                "https://placehold.co/150x150/EEEEEE/333333?text=Profile"
              }
              alt="프로필 이미지"
              className="w-24 h-24 object-cover rounded-full shadow-md"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <Mail size={16} className="mr-2 text-blue-500" />{" "}
                  {profile.email}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone size={16} className="mr-2 text-blue-500" />{" "}
                  {profile.phone}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={16} className="mr-2 text-blue-500" />{" "}
                  {profile.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 상세 포트폴리오 섹션 */}
        {filteredPortfolio.length === 0 && searchTerm ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-lg text-gray-500">
            <Search size={30} className="mx-auto mb-3" />
            <p>검색 결과가 없습니다. 다른 검색어로 시도해 보세요.</p>
          </div>
        ) : (
          filteredPortfolio.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white p-6 rounded-2xl shadow-xl mb-8"
              >
                <div className="flex items-center border-b pb-3 mb-4">
                  <Icon size={24} className="mr-3 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                </div>
                <div>
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
  );
}
