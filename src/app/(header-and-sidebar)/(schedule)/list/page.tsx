// 기업 공고 리스트
"use client";

import React, { useState } from "react";
// Dropdown, Input 등은 실제 프로젝트에서는 별도 컴포넌트로 분리될 수 있으나, 여기서는 HTML 기본 요소를 사용합니다.

// ----------------------------------------------------
// 1. 타입 및 데이터 정의
// ----------------------------------------------------

interface JobItem {
  id: number;
  title: string;
  department: string;
  period: string;
  qualification: string; // 경력, 신입, 대졸 등
  type: string; // 정규직, 계약직 등
  location: string;
  deadline: string;
}

const dummyJobList: JobItem[] = [
  {
    id: 1,
    title: "2026년 GS파워 신입사원 공개채용",
    department: "직무",
    qualification: "경력, 신입 | 대졸 | 경기 부천시",
    type: "정규직",
    location: "지 에스 파 워(주)",
    period: "25.09.29",
    deadline: "~ 25.09.29",
  },
  {
    id: 2,
    title: "2026년 GS파워 신입사원 공개채용",
    department: "직무",
    qualification: "경력, 신입 | 대졸 | 경기 부천시",
    type: "정규직",
    location: "지 에스 파 워(주)",
    period: "25.09.29",
    deadline: "~ 25.09.29",
  },
  {
    id: 3,
    title: "2026년 GS파워 신입사원 공개채용",
    department: "직무",
    qualification: "경력, 신입 | 대졸 | 경기 부천시",
    type: "정규직",
    location: "지 에스 파 워(주)",
    period: "25.09.29",
    deadline: "~ 25.09.29",
  },
];

// ----------------------------------------------------
// 2. JobItem 컴포넌트 (개별 채용 공고 항목)
// ----------------------------------------------------

const JobListItem: React.FC<{ item: JobItem }> = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      {/* 왼쪽 공고 정보 */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-800">
            {item.location}
          </span>
          <h3 className="text-xl font-extrabold text-gray-900 hover:underline cursor-pointer">
            {item.title}
          </h3>
          <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">
            [더보기]
          </a>
        </div>

        <p className="text-gray-600 text-sm">{item.department}</p>

        <p className="text-gray-500 text-sm">
          {item.qualification} | {item.type}
        </p>
      </div>

      {/* 오른쪽 버튼 및 마감일 */}
      <div className="flex flex-col items-end space-y-2">
        <a href="/registration">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition duration-150">
            세부사항 등록
          </button>
        </a>
        <p className="text-gray-500 text-sm">{item.deadline}</p>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. 메인 JobList 컴포넌트
// ----------------------------------------------------

export default function List() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    // 레이아웃이 '헤더-사이드바-메인' 구조이므로, 이 div는 메인 컨텐츠를 담당합니다.
    <div className="flex-1 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg h-full space-y-8">
        {/* 1. 헤더 영역 */}
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            채용 공고 리스트
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            채용 공고를 검색하고, 세부 일정을 등록해보세요.
          </p>
        </header>

        {/* 2. 검색 및 필터 영역 */}
        <div className="space-y-6">
          {/* 검색 바 */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-gray-500 font-semibold mr-2">검색어</span>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="flex-1 p-2 outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 text-gray-600 hover:text-gray-800 transition duration-150">
              {/* 돋보기 아이콘 대체 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* 필터 그룹 */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-gray-700">필터</h3>
            <div className="flex items-center space-x-6">
              {/* 지원 자격 필터 */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">지원자격</span>
                {["경력", "신입", "인턴"].map((label) => (
                  <label
                    key={label}
                    className="flex items-center space-x-1 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600 rounded"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {/* 근무 지역 필터 */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">근무 지역</span>
                {/* 시 드롭다운 (HTML select 태그 사용) */}
                <select className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500">
                  <option>시</option>
                  <option>서울</option>
                  <option>경기</option>
                </select>
                {/* 구 드롭다운 */}
                <select className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500">
                  <option>구</option>
                  <option>강남구</option>
                  <option>부천시</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 공고 리스트 영역 */}
        <div className="divide-y divide-gray-100 border-t border-gray-200">
          {dummyJobList.map((item) => (
            <JobListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
