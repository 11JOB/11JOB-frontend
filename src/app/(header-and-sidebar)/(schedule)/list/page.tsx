"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Briefcase } from "lucide-react"; // 아이콘 추가

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
    department: "전기 및 배관 직무",
    qualification: "경력, 신입",
    type: "정규직",
    location: "지 에스 파 워(주)", // 기업명
    period: "25.09.29",
    deadline: "~ 25.09.29", // 마감일
  },
  {
    id: 2,
    title: "2026년 삼성전자 DX부문 신입 공채",
    department: "Software Engineer",
    qualification: "신입 | 학사 이상",
    type: "정규직",
    location: "삼성전자(주)", // 기업명
    period: "25.10.15",
    deadline: "~ 25.10.15", // 마감일
  },
  {
    id: 3,
    title: "2026년 현대자동차 연구개발본부 채용",
    department: "자율주행 시스템 개발",
    qualification: "경력 | 석사 이상",
    type: "정규직",
    location: "현대자동차(주)", // 기업명
    period: "25.11.01",
    deadline: "~ 25.11.01", // 마감일
  },
];

// ----------------------------------------------------
// 2. JobItem 컴포넌트 (개별 채용 공고 항목)
// ----------------------------------------------------

const JobListItem: React.FC<{ item: JobItem }> = ({ item }) => {
  // 쿼리 파라미터를 안전하게 인코딩
  const companyName = encodeURIComponent(item.location);
  const deadlineDate = encodeURIComponent(item.deadline.replace("~ ", "")); // "~ " 제거 후 인코딩

  // 쿼리 파라미터가 포함된 등록 페이지 URL 생성
  const registrationHref = `/registration?company=${companyName}&deadline=${deadlineDate}`;

  return (
    // 💡 UI 개선: 카드 형태로 변경, hover 효과 추가
    <div className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
      {/* 왼쪽 공고 정보 */}
      <div className="flex flex-col space-y-1 w-2/3">
        {/* 기업명 및 제목 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {item.location}
          </span>
          <h3 className="text-xl font-extrabold text-gray-900 hover:text-blue-700 transition">
            {item.title}
          </h3>
          {/* <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">
            [더보기]
          </a> */}
        </div>

        {/* 상세 정보 */}
        <p className="text-gray-600 text-base font-medium mt-1">
          {item.department}
        </p>

        {/* 자격 및 타입 아이콘과 함께 표시 */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 pt-1">
          <div className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span>
              {item.qualification} | {item.type}
            </span>
          </div>
          {/* <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{item.period}</span>
            </div> */}
        </div>
      </div>

      {/* 오른쪽 버튼 및 마감일 */}
      <div className="flex flex-col items-end space-y-3 w-1/3 min-w-[150px]">
        {/* 수정: 버튼 스타일 개선 (오렌지 색상 강조) */}
        <a href={registrationHref}>
          <button className="px-5 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-200 hover:bg-orange-600 transition duration-150 transform hover:scale-105 active:scale-100">
            세부 일정 등록
          </button>
        </a>
        {/* 마감일 강조 */}
        <p className="text-red-500 text-base font-extrabold bg-red-50 px-3 py-1 rounded-lg border border-red-100">
          마감: {item.deadline}
        </p>
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
    // 레이아웃 컨테이너
    <div className="flex-1 p-4 sm:p-8">
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl h-full space-y-8">
        {/* 1. 헤더 영역 */}
        <header className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            채용 공고 탐색
          </h1>
          <p className="text-base text-gray-500 mt-1">
            최신 채용 공고를 검색하고, 나만의 취업 일정으로 등록하세요.
          </p>
        </header>

        {/* 2. 검색 및 필터 영역 */}
        <div className="space-y-6">
          {/* 검색 바 (더 세련되게) */}
          <div className="flex items-center border-2 border-blue-500 rounded-xl p-3 bg-white shadow-md focus-within:ring-4 focus-within:ring-blue-100 transition duration-200">
            <Search className="w-5 h-5 text-blue-500 mr-3" />
            <input
              type="text"
              placeholder="기업명, 직무 등을 입력하여 검색하세요."
              className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition duration-150 ml-2">
              검색
            </button>
          </div>

          {/* 필터 그룹 (더 깔끔하게) */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">
              상세 필터
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              {/* 지원 자격 필터 */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">지원자격</span>
                {["경력", "신입", "인턴"].map((label) => (
                  <label
                    key={label}
                    className="flex items-center space-x-1 text-sm text-gray-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 transition duration-150 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {/* 근무 지역 필터 (드롭다운 개선) */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">근무 지역</span>
                {/* 시 드롭다운 */}
                <div className="relative">
                  <select className="appearance-none border border-gray-300 rounded-lg p-2 pr-8 text-gray-700 bg-white hover:border-blue-500 transition focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option>전체 시</option>
                    <option>서울</option>
                    <option>경기</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* 구 드롭다운 */}
                <div className="relative">
                  <select className="appearance-none border border-gray-300 rounded-lg p-2 pr-8 text-gray-700 bg-white hover:border-blue-500 transition focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option>전체 구/군</option>
                    <option>강남구</option>
                    <option>부천시</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 공고 리스트 영역 */}
        <div className="space-y-4 pt-4">
          <div className="text-lg font-bold text-gray-700">
            총 {dummyJobList.length}건의 공고
          </div>
          {dummyJobList.map((item) => (
            <JobListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
