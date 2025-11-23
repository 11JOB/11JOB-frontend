/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Briefcase, MapPin } from "lucide-react";
import { getJobContent } from "@/api/job";

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
  const formattedDeadline = item.expirationDate.replace(/-/g, ".");
  const isExpired = new Date(item.expirationDate) < new Date();

  return (
    <div
      className={`flex justify-between items-center p-6 bg-white border rounded-xl shadow-md transition duration-200 ease-in-out ${
        isExpired
          ? "border-gray-200 opacity-60"
          : "border-gray-100 hover:shadow-lg cursor-pointer"
      }`}
    >
      <div className="flex flex-col space-y-1 w-2/3">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 mt-1">
            {item.companyName}
          </span>

          <a
            href={item.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xl font-extrabold ${
              isExpired ? "cursor-not-allowed" : "hover:text-blue-700"
            }`}
            onClick={(e) => {
              if (isExpired) e.preventDefault();
            }}
          >
            {item.title}
          </a>
        </div>

        <p className="text-gray-600 text-base font-medium mt-1 pl-1">
          {item.jobCodeName}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 pt-1 text-sm text-gray-500">
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

      <div className="flex flex-col items-end space-y-3 w-1/3 min-w-[150px]">
        <button
          className={`px-5 py-2 text-sm font-bold rounded-full ${
            isExpired
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
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
    <div className="flex-1 p-6 sm:p-8 min-h-screen bg-gray-50">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-8">
        {/* 검색 */}
        <div className="flex items-center border-2 border-blue-500 rounded-xl p-3 bg-white shadow-md">
          <Search className="w-5 h-5 text-blue-500 mr-3" />
          <input
            type="text"
            placeholder="기업명, 직무 등을 입력하세요"
            className="flex-1 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-lg"
          >
            검색
          </button>
        </div>

        {/* 리스트 */}
        <div className="space-y-4">
          {jobs.map((j) => (
            <JobListItem key={j.jobId} item={j} />
          ))}
        </div>

        {/* ⭐ 페이지네이션 (그룹 방식) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {/* 이전 그룹 */}
            <button
              onClick={() => goToPage(startPage - 1)}
              disabled={currentGroup === 0}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              ‹ 이전
            </button>

            {/* 그룹 페이지 번호 */}
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

            {/* 다음 그룹 */}
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
