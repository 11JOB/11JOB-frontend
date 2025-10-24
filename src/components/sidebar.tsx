"use client";
import { useState } from "react";

const SideBarList = [
  {
    title: "내 캘린더",
    link: "/",
  },
  {
    title: "일정 관리",
    subMenu: [
      {
        title: "등록",
        link: "/schedule/new",
      },
      {
        title: "목록",
        link: "/schedule/list",
      },
    ],
  },
  {
    title: "포트폴리오 관리",
    subMenu: [
      {
        title: "등록",
        link: "/portfolio/new",
      },
      {
        title: "조회",
        link: "/portfolio/list",
      },
    ],
  },
  {
    title: "마이페이지",
    link: "/mypage",
  },
];

export default function Sidebar() {
  // 열려있는 서브 메뉴를 관리하는 상태. 배열의 인덱스를 저장합니다.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleSubMenu = (index: number) => {
    // 현재 열려있는 메뉴를 다시 클릭하면 닫고, 아니면 새로운 메뉴를 엽니다.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // 메인 컨테이너 스타일 (이미지 기반: 둥근 모서리, 흰색 배경, 그림자, 고정 폭)
    <div className="w-64 p-4 bg-white rounded-xl shadow-lg font-sans">
      <nav className="space-y-4">
        {SideBarList.map((item, index) => (
          <div key={index}>
            {/* 메인 메뉴 항목 (서브 메뉴 유무에 따라 스타일 및 이벤트 변경) */}
            {item.link ? (
              // 서브 메뉴가 없는 항목 (단순 링크)
              <a
                href={item.link}
                className="block text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-150"
              >
                {item.title}
              </a>
            ) : (
              // 서브 메뉴가 있는 항목 (클릭 이벤트 추가)
              <button
                onClick={() => toggleSubMenu(index)}
                className="w-full flex justify-between items-center text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-150 focus:outline-none"
              >
                {item.title}
                {/* 토글 아이콘 (아이콘 라이브러리 미사용 시 텍스트로 대체) */}
                {/* {openIndex === index ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />} */}
                {openIndex === index ? "▲" : "▼"}
              </button>
            )}

            {/* 서브 메뉴 목록 */}
            {item.subMenu && (
              <ul
                // 서브 메뉴 열림/닫힘 상태에 따른 스타일 적용
                className={`pl-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a
                      href={subItem.link}
                      // 서브 메뉴 스타일: 약간 작은 글꼴, 덜 굵은 글꼴, 들여쓰기된 위치
                      className="block py-1 text-gray-600 text-base font-medium hover:text-blue-500 transition duration-150"
                    >
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
