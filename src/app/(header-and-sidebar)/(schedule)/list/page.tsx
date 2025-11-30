"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Briefcase, MapPin } from "lucide-react";
import { getJobContent } from "@/api/job";
import { useRouter } from "next/navigation"; // 추가

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
  const router = useRouter(); // 추가
  const formattedDeadline = item.expirationDate.replace(/-/g, ".");
  const isExpired = new Date(item.expirationDate) < new Date();

  // ✅ 세부 일정 등록 클릭 시 storage 저장 후 이동
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

    router.push("/registration"); // 수정
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

export default function List() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  // Redirect to /auth if no token
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("accessToken")) {
      window.location.href = "/auth";
    }
  }, []);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const PAGE_GROUP_SIZE = 5;

  const fetchJobs = useCallback(async (search: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const trimmed = search.trim();

      const response = await getJobContent(
        trimmed ? { keyword: trimmed, page } : { page }
      );

      setJobs(response.content);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.error(e);
      setError("채용 공고 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(currentSearchTerm, currentPage);
  }, [fetchJobs, currentSearchTerm, currentPage]);

  const handleSearch = () => {
    setCurrentPage(0);
    setCurrentSearchTerm(searchTerm);
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  // ⭐ 페이지 그룹 계산
  const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);

  return (
    <div className="flex-1 p-4 sm:p-8 min-h-screen bg-gray-50">
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
              <p>다른 키워드로 다시 검색해보세요.</p>
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
