"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 현재 경로를 가져오기 위한 usePathname 추가
// Lucide Icons를 사용합니다.
import {
  Calendar,
  Briefcase,
  FileText,
  User,
  ChevronDown,
  LayoutList,
} from "lucide-react";
import clsx from "clsx";

// 메뉴 항목에 대한 타입 정의
interface SubMenuItem {
  title: string;
  link: string;
}

interface SideBarItem {
  title: string;
  icon: React.ElementType; // 아이콘 컴포넌트를 받기 위한 타입
  link?: string;
  subMenu?: SubMenuItem[];
}

// 각 메뉴 항목에 아이콘 컴포넌트를 추가합니다.
const SideBarList: SideBarItem[] = [
  {
    title: "내 캘린더",
    icon: Calendar,
    link: "/",
  },
  {
    title: "취업 공고 및 일정",
    icon: Briefcase,
    subMenu: [
      {
        title: "취업 공고",
        link: "/list",
      },
      {
        title: "내 취업 일정",
        link: "/view",
      },
    ],
  },
  {
    title: "포트폴리오 관리",
    icon: FileText,
    subMenu: [
      {
        title: "등록",
        link: "/portfolio/registration",
      },
      {
        title: "조회",
        link: "/portfolio/view",
      },
    ],
  },
  {
    title: "마이페이지",
    icon: User,
    link: "/mypage",
  },
];

// Next.js Link 컴포넌트를 사용하도록 수정
const CustomLink: React.FC<{
  href: string;
  className: string;
  children: React.ReactNode;
}> = ({ href, className, children }) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 서브 메뉴 토글 함수
  const toggleSubMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 현재 활성 상태의 Link를 가져오기 위해 usePathname 사용
  const activeLink = usePathname();

  return (
    // 메인 컨테이너: 약간 좁은 폭 (w-64), 짙은 배경색, 둥근 모서리, 깊은 그림자
    <div className="w-64 min-h-screen p-4 bg-gray-900 shadow-2xl font-sans text-white">
      {/* 사이드바 헤더 / 로고 */}
      <div className="flex items-center space-x-2 p-3 mb-6 border-b border-gray-700/50">
        <LayoutList className="text-blue-400" size={24} />
        <h1 className="text-xl font-bold tracking-wider text-blue-400">
          MENU{" "}
        </h1>
      </div>

      <nav className="space-y-1">
        {SideBarList.map((item, index) => {
          const ItemIcon = item.icon;

          // 링크 경로가 활성 상태인지 확인 (서브메뉴는 제외)
          const isItemActive = item.link === activeLink;

          // 서브 메뉴가 열려 있는지 확인
          const isOpen = openIndex === index;

          const baseClasses =
            "flex items-center w-full rounded-lg p-3 text-sm font-semibold transition-all duration-200 cursor-pointer";

          // 메인 메뉴 항목 렌더링 함수
          const renderItem = (linkProps: boolean, itemLink?: string) => (
            <div
              className={clsx(baseClasses, "group", {
                // 활성화/호버 스타일: 파란색 배경과 밝은 텍스트
                "bg-blue-600 text-white shadow-md": isItemActive && linkProps,
                "hover:bg-gray-800 hover:text-blue-400":
                  !isItemActive || !linkProps,
                "text-gray-200": !isItemActive && !linkProps,
              })}
              onClick={() => {
                if (item.subMenu) {
                  toggleSubMenu(index);
                } else if (itemLink) {
                  // Link 클릭 시뮬레이션
                  console.log(`Navigating to: ${itemLink}`);
                }
              }}
            >
              <ItemIcon
                size={18}
                className={clsx(
                  "mr-3",
                  isItemActive && linkProps
                    ? "text-white"
                    : "text-gray-400 group-hover:text-blue-400"
                )}
              />
              <span className="flex-1">{item.title}</span>

              {/* 토글 아이콘 (서브 메뉴가 있을 때만) */}
              {item.subMenu && (
                <ChevronDown
                  size={16}
                  className={clsx(
                    "transition-transform duration-300 text-gray-400",
                    {
                      "rotate-180": isOpen, // 열렸을 때 회전
                    }
                  )}
                />
              )}
            </div>
          );

          return (
            <div key={index}>
              {/* Link 컴포넌트 시뮬레이션 */}
              {item.link ? (
                <CustomLink href={item.link} className="block">
                  {renderItem(true, item.link)}
                </CustomLink>
              ) : (
                renderItem(false)
              )}

              {/* 서브 메뉴 목록 */}
              {item.subMenu && (
                <ul
                  // 서브 메뉴 열림/닫힘 상태에 따른 스타일 적용
                  className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  {item.subMenu.map((subItem, subIndex) => {
                    const isSubItemActive = subItem.link === activeLink;
                    return (
                      <li key={subIndex}>
                        <CustomLink
                          href={subItem.link}
                          className={clsx(
                            "flex items-center py-2 pl-5 pr-3 text-xs font-medium rounded-lg transition-colors duration-200",
                            {
                              "text-blue-400 bg-gray-800 font-semibold":
                                isSubItemActive,
                              "text-gray-400 hover:text-blue-300 hover:bg-gray-800":
                                !isSubItemActive,
                            }
                          )}
                        >
                          {/* 서브 메뉴 구분자 */}
                          <span className="w-1 h-1 rounded-full mr-3 bg-gray-600"></span>
                          {subItem.title}
                        </CustomLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
