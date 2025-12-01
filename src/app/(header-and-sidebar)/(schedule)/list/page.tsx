"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Briefcase, MapPin } from "lucide-react";
import { getJobContent } from "@/api/job";
import { useRouter, useSearchParams } from "next/navigation";

interface Job {
  jobId: number;
  requestNo: string;
  companyName: string;
  title: string;
  workAddress: string;
  jobCodeName: string;
  academicName: string;
  careerName: string;
  registrationDate: string;
  expirationDate: string;
  detailUrl: string;
}

const JobListItem: React.FC<{ item: Job }> = ({ item }) => {
  const router = useRouter();
  const formattedDeadline = item.expirationDate.replace(/-/g, ".");
  const isExpired = new Date(item.expirationDate) < new Date();

  const goRegistration = () => {
    if (isExpired) return;

    sessionStorage.setItem(
      "selectedJob",
      JSON.stringify({
        jobId: item.jobId,
        companyName: item.companyName,
        title: item.title,
        expirationDate: item.expirationDate,
      })
    );

    router.push("/registration");
  };

  return (
    <div
      className={`flex justify-between items-center p-6 bg-white border rounded-xl shadow-md transition duration-200 ease-in-out ${
        isExpired
          ? "border-gray-200 opacity-60"
          : "border-gray-100 hover:shadow-lg cursor-pointer"
      }`}
    >
      {/* 왼쪽 공고 정보 */}
      <div className="flex flex-col space-y-1 w-2/3">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 mt-1">
            {item.companyName}
          </span>

          <h3 className="text-xl font-extrabold text-gray-900 transition">
            <a
              href={item.detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-blue-700 transition ${
                isExpired ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={(e) => {
                if (isExpired) e.preventDefault();
              }}
            >
              {item.title}
            </a>
          </h3>
        </div>

        <p className="text-gray-600 text-base font-medium mt-1 pl-1">
          {item.jobCodeName}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 pt-1">
          <div className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span>
              {item.careerName} | {item.academicName}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{item.workAddress.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* 오른쪽 버튼 및 마감일 */}
      <div className="flex flex-col items-end space-y-3 w-1/3 min-w-[150px]">
        <button
          onClick={goRegistration}
          className={`px-5 py-2 text-sm font-bold rounded-full shadow-lg shadow-orange-200 transition duration-150 transform hover:scale-105 active:scale-100 ${
            isExpired
              ? "bg-gray-400 text-gray-100 cursor-not-allowed shadow-none"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
          disabled={isExpired}
        >
          {isExpired ? "마감됨" : "세부 일정 등록"}
        </button>

        <p
          className={`text-base font-extrabold px-3 py-1 rounded-lg border ${
            isExpired
              ? "text-gray-600 bg-gray-100 border-gray-200"
              : "text-red-500 bg-red-50 border-red-100"
          }`}
        >
          마감: {formattedDeadline}
        </p>
      </div>
    </div>
  );
};

const careerOptions = ["신입", "경력", "무관"];
const locationOptions = [
  "서울",
  "경기",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
];

// 🔹 실제 로직/상태/훅들은 여기로
function ListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [textKeyword, setTextKeyword] = useState("");

  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_GROUP_SIZE = 5;

  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  // 🔒 인증 체크
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("accessToken")) {
      window.location.href = "/auth";
    }
  }, []);

  // 🌐 URL 쿼리 → 상태 초기화 (최초 1번)
  useEffect(() => {
    if (initializedFromUrl) return;

    const keywordFromUrl = searchParams.get("keyword") || "";
    const careerFromUrl = searchParams.get("career");
    const locationFromUrl = searchParams.get("location");
    const pageFromUrl = searchParams.get("page");
    const parsedPage = pageFromUrl ? parseInt(pageFromUrl, 10) : 0;

    if (keywordFromUrl) {
      setSearchTerm(keywordFromUrl);
      setTextKeyword(keywordFromUrl);
    }

    if (careerFromUrl) {
      setSelectedCareer(careerFromUrl);
    }

    if (locationFromUrl) {
      setSelectedLocation(locationFromUrl);
    }

    if (!Number.isNaN(parsedPage) && parsedPage >= 0) {
      setCurrentPage(parsedPage);
    }

    setInitializedFromUrl(true);
  }, [searchParams, initializedFromUrl]);

  // 🔍 검색 버튼 클릭 (검색어 → searchKeyword)
  const handleSearch = () => {
    const trimmed = searchTerm.trim();

    setTextKeyword(trimmed);
    setCurrentPage(0);

    const params = new URLSearchParams();
    if (trimmed) params.set("keyword", trimmed);
    if (selectedCareer) params.set("career", selectedCareer);
    if (selectedLocation) params.set("location", selectedLocation);
    params.set("page", "0");

    router.push(`/list?${params.toString()}`);
  };

  // 🎯 경력 선택 (careerConditionName)
  const handleCareerClick = (career: string) => {
    const willSelect = selectedCareer === career ? null : career;

    setSelectedCareer(willSelect);
    setCurrentPage(0);

    const params = new URLSearchParams();
    if (textKeyword) params.set("keyword", textKeyword);
    if (willSelect) params.set("career", willSelect);
    if (selectedLocation) params.set("location", selectedLocation);
    params.set("page", "0");

    router.push(`/list?${params.toString()}`);
  };

  // 📍 지역 선택 (workLocation)
  const handleLocationChange = (value: string) => {
    const nextLocation = value || null;

    setSelectedLocation(nextLocation);
    setCurrentPage(0);

    const params = new URLSearchParams();
    if (textKeyword) params.set("keyword", textKeyword);
    if (selectedCareer) params.set("career", selectedCareer);
    if (nextLocation) params.set("location", nextLocation);
    params.set("page", "0");

    router.push(`/list?${params.toString()}`);
  };

  // 🔄 검색 조건 초기화
  const handleResetFilters = () => {
    setSearchTerm("");
    setTextKeyword("");
    setSelectedCareer(null);
    setSelectedLocation(null);
    setCurrentPage(0);

    router.push("/list");
  };

  // 📄 페이지 이동 시 URL 쿼리와 동기화
  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);

    const params = new URLSearchParams();
    if (textKeyword) params.set("keyword", textKeyword);
    if (selectedCareer) params.set("career", selectedCareer);
    if (selectedLocation) params.set("location", selectedLocation);
    params.set("page", String(page));

    router.push(`/list?${params.toString()}`);
  };

  const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);

  // 📡 공고 리스트 불러오기
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        // getJobContent 옵션과 API 쿼리 매핑
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          page: currentPage,
        };

        if (textKeyword) {
          params.keyword = textKeyword; // → searchKeyword
        }
        if (selectedCareer) {
          params.careerConditionName = selectedCareer;
        }
        if (selectedLocation) {
          params.workLocation = selectedLocation;
        }

        const response = await getJobContent(params);

        setJobs(response.content);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.error(e);
        setError("채용 공고 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    // URL에서 상태 초기화 끝난 후에만 호출
    if (initializedFromUrl) {
      fetchJobs();
    }
  }, [
    textKeyword,
    selectedCareer,
    selectedLocation,
    currentPage,
    initializedFromUrl,
  ]);

  return (
    <div className="flex-1 p-4 sm:p-8 min-h-screen ">
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl h-full space-y-8 max-w-4xl mx-auto">
        <header className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            채용 공고 탐색
          </h1>
          <p className="text-base text-gray-500 mt-1">
            최신 채용 공고를 검색하고, 나만의 취업 일정으로 등록하세요.
          </p>
        </header>

        {/* 검색 바 */}
        <div className="flex items-center border-2 border-blue-500 rounded-xl p-3 bg-white shadow-md focus-within:ring-4 focus-within:ring-blue-100 transition duration-200">
          <Search className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="기업명, 직무 등을 입력하여 검색하세요."
            className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition duration-150 ml-2 flex-shrink-0"
          >
            검색
          </button>
        </div>

        {/* 🔹 필터 영역 + 조건 초기화 버튼 */}
        <section className="mt-4 p-4 sm:p-5 bg-[#f0f4fc] border border-blue-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-m font-semibold text-gray-800">
                  [조건으로 검색]
                </h2>
              </div>
            </div>

            {/* 현재 활성화된 조건 표시 + 초기화 버튼 */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                현재 조건:{" "}
                <strong className="ml-1 text-gray-800">
                  {textKeyword
                    ? `검색어 "${textKeyword}"`
                    : selectedCareer
                    ? `경력 ${selectedCareer}`
                    : selectedLocation
                    ? `지역 ${selectedLocation}`
                    : "전체"}
                </strong>
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-full border border-gray-300 bg-white text-[11px] font-medium text-gray-600 hover:bg-gray-100"
              >
                조건 초기화
              </button>
            </div>
          </div>

          <div className="mt-2 grid gap-4 md:grid-cols-2">
            {/* 경력 필터 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-800">
                  경력 선택
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {careerOptions.map((career) => {
                  const active = selectedCareer === career;
                  return (
                    <button
                      key={career}
                      type="button"
                      onClick={() => handleCareerClick(career)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 flex items-center gap-1 ${
                        active
                          ? "bg-blue-500 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {career}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 지역 필터 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold text-gray-800">
                  지역 선택
                </span>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <MapPin className="w-4 h-4 text-rose-400" />
                </div>
                <select
                  value={selectedLocation || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 appearance-none"
                >
                  <option value="">전체 지역</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {/* 커스텀 셀렉트 화살표 */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 리스트 */}
        <div className="space-y-4 pt-4">
          <div className="text-lg font-bold text-gray-700">
            총 {loading ? "..." : jobs.length}건의 공고
          </div>

          {loading && (
            <div className="text-center p-12 text-blue-500 font-medium">
              채용 공고를 불러오는 중...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="text-center p-12 text-gray-500 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xl font-bold mb-2">검색 결과가 없습니다.</p>
              <p>다른 키워드 또는 조건으로 다시 검색해보세요.</p>
            </div>
          )}

          {!loading &&
            !error &&
            jobs.length > 0 &&
            jobs.map((item) => <JobListItem key={item.jobId} item={item} />)}
        </div>

        {/* 페이지네이션 (그룹) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => goToPage(startPage - 1)}
              disabled={currentGroup === 0}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              ‹ 이전
            </button>

            {Array.from(
              { length: endPage - startPage },
              (_, i) => startPage + i
            ).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(endPage)}
              disabled={endPage >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              다음 ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 페이지 기본 컴포넌트: Suspense로 ListContent 감싸기
export default function ListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 p-8 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center text-blue-500 font-medium">
            로딩 중...
          </div>
        </div>
      }
    >
      <ListContent />
    </Suspense>
  );
}
