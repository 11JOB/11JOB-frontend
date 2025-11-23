/**
 * 채용 일정 목록 및 상세 보기 애플리케이션 (Mock Data 전용)
 * - 새로운 JSON 구조에 맞춰 Mock Data를 정의하고 사용합니다.
 * - 목록에서 항목을 클릭하면 상세 페이지로 전환됩니다.
 * - 모든 데이터는 클라이언트 내부에 정의되어 있으며, 외부 데이터베이스 연결은 없습니다.
 */
"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Zap,
  FileText,
  ChevronLeft,
  Building2,
  Link,
  Download,
} from "lucide-react";

// -----------------------------------------------------------------------------
// 1. 타입 정의 및 유틸리티
// -----------------------------------------------------------------------------

/** 첨부 파일 구조 */
interface FileItem {
  fileId: number;
  originalName: string; // 원본 파일 이름 (화면에 표시)
  filePath: string; // 파일 경로 (목데이터에서는 더미 경로 사용)
}

/** 세부 항목 구조 */
interface DetailItem {
  detailId: number;
  title: string;
  content: string;
}

/** 메인 스케줄 문서 구조 (사용자 요청 JSON 구조 기반) */
interface ScheduleDocument {
  scheduleId: number;
  companyId: number;
  companyName: string;
  title: string; // 주요 일정 제목 (기존 mainTitle)
  scheduleDate: string; // YYYY-MM-DD
  createdDate: string; // ISO 8601
  updatedDate: string; // ISO 8601
  details: DetailItem[];
  files: FileItem[];
}

// 오늘 날짜를 기준으로 과거, 현재, 미래 날짜를 계산
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split("T")[0];
const formatDateTimeISO = (date: Date) => date.toISOString();

const dateToday = formatDate(today);
const dateUpcoming = formatDate(
  new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)
);
const datePast = formatDate(
  new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)
);

// -----------------------------------------------------------------------------
// 2. 목 데이터 (Mock Data)
// -----------------------------------------------------------------------------

const MOCK_SCHEDULES: ScheduleDocument[] = [
  {
    scheduleId: 1001,
    companyId: 1,
    companyName: "미래 기술 (주)",
    title: "최종 면접 (임원)",
    scheduleDate: dateUpcoming, // 미래 일정
    createdDate: formatDateTimeISO(
      new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    ),
    updatedDate: formatDateTimeISO(
      new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    ),
    details: [
      { detailId: 10, title: "면접관", content: "김철수 상무, 이영희 이사" },
      {
        detailId: 11,
        title: "준비 사항",
        content: "5분 자기소개 및 핵심 역량 PT 자료 (10장 이내). 정장 필수.",
      },
    ],
    files: [
      {
        fileId: 100,
        originalName: "이력서_v3.pdf",
        filePath: "/docs/resume_v3.pdf",
      },
      {
        fileId: 101,
        originalName: "포트폴리오_2025.zip",
        filePath: "/docs/portfolio.zip",
      },
    ],
  },
  {
    scheduleId: 1002,
    companyId: 2,
    companyName: "글로벌 솔루션즈",
    title: "온라인 코딩 테스트",
    scheduleDate: dateToday, // 오늘 일정
    createdDate: formatDateTimeISO(
      new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
    ),
    updatedDate: formatDateTimeISO(
      new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
    ),
    details: [
      { detailId: 20, title: "제한 시간", content: "2시간 30분" },
      {
        detailId: 21,
        title: "접속 링크",
        content: "https://codetest.globalsol.com/start",
      },
      { detailId: 22, title: "언어", content: "Python, Java, C++ 중 택 1" },
    ],
    files: [],
  },
  {
    scheduleId: 1003,
    companyId: 3,
    companyName: "혁신 바이오텍",
    title: "인적성 검사 (온라인)",
    scheduleDate: datePast, // 과거 일정
    createdDate: formatDateTimeISO(
      new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)
    ),
    updatedDate: formatDateTimeISO(
      new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
    ),
    details: [
      { detailId: 30, title: "결과", content: "합격 (다음 전형 대기)" },
      {
        detailId: 31,
        title: "주의사항",
        content: "모바일 접속 불가. PC로만 응시 가능",
      },
    ],
    files: [
      {
        fileId: 300,
        originalName: "인적성_안내.pdf",
        filePath: "/docs/aptitude_guide.pdf",
      },
    ],
  },
  {
    scheduleId: 1004,
    companyId: 1,
    companyName: "미래 기술 (주)",
    title: "1차 실무진 면접",
    scheduleDate: datePast, // 과거 일정 (목록 정렬 테스트용)
    createdDate: formatDateTimeISO(
      new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000)
    ),
    updatedDate: formatDateTimeISO(
      new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000)
    ),
    details: [
      { detailId: 40, title: "면접 내용", content: "프로젝트 경험 심층 질문" },
    ],
    files: [],
  },
];

// -----------------------------------------------------------------------------
// 3. 컴포넌트: ScheduleCard (일정 카드)
// -----------------------------------------------------------------------------

/** 일정 목록의 개별 카드 */
const ScheduleCard: React.FC<{
  schedule: ScheduleDocument;
  onSelect: (id: number) => void;
}> = ({ schedule, onSelect }) => {
  // scheduleDate를 기준으로 Date 객체 생성 (시간은 00:00으로 가정)
  const scheduleDateTime = new Date(`${schedule.scheduleDate}T00:00:00`);
  const isPast = scheduleDateTime < today;

  // 카드 스타일 정의
  const cardStyle = isPast
    ? "bg-gray-50 border-gray-200 text-gray-500 opacity-80 cursor-pointer"
    : "bg-white border-blue-100 shadow-sm hover:shadow-lg transition duration-200 cursor-pointer";

  // 날짜 포맷 (MM/DD)
  const formattedDate = scheduleDateTime.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });

  // 요일
  const weekday = scheduleDateTime.toLocaleDateString("ko-KR", {
    weekday: "short",
  });

  return (
    <div
      className={`flex space-x-4 p-4 border rounded-xl ${cardStyle}`}
      onClick={() => onSelect(schedule.scheduleId)}
      role="button"
    >
      {/* 날짜/요일 */}
      <div
        className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 flex-shrink-0 ${
          isPast
            ? "bg-gray-200 text-gray-600"
            : "bg-blue-500 text-white shadow-md"
        }`}
      >
        <span className="text-lg font-bold leading-none">
          {formattedDate.replace(".", "/").replace(".", "")}
        </span>
        <span className="text-xs font-medium mt-0.5">{weekday}</span>
      </div>

      {/* 내용 */}
      <div className="flex flex-col space-y-1 w-full min-w-0">
        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border truncate ${
              isPast
                ? "bg-gray-200 text-gray-600 border-gray-300"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {schedule.companyName}
          </span>
          <h2
            className={`text-lg font-bold text-gray-900 truncate ${
              isPast ? "line-through text-gray-400" : ""
            }`}
          >
            {schedule.title}
          </h2>
        </div>

        {/* 세부 정보 요약 */}
        <div className="flex items-start space-x-4 text-sm text-gray-600 mt-1">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-gray-400" />
            <span>세부 {schedule.details.length}개</span>
          </div>
          {schedule.files && schedule.files.length > 0 && (
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>파일 {schedule.files.length}개</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. 컴포넌트: ScheduleListView (목록 뷰)
// -----------------------------------------------------------------------------

const ScheduleListView: React.FC<{
  schedules: ScheduleDocument[];
  onSelectSchedule: (id: number) => void;
}> = ({ schedules, onSelectSchedule }) => {
  // 메모리에서 날짜와 시간 순으로 정렬 (다가오는 일정 > 과거 일정)
  const sortedSchedules = useMemo(() => {
    const now = new Date();

    return [...schedules].sort((a, b) => {
      // scheduleDate만 사용하며, 정렬을 위해 00:00 시간을 가정
      const dateA = new Date(`${a.scheduleDate}T00:00:00`);
      const dateB = new Date(`${b.scheduleDate}T00:00:00`);

      const isPastA = dateA < now;
      const isPastB = dateB < now;

      // 1. 과거 일정을 뒤로 보냄
      if (isPastA !== isPastB) {
        return isPastA ? 1 : -1;
      }

      // 2. 날짜 순으로 정렬 (오름차순: 다가오는 순)
      return dateA.getTime() - dateB.getTime();
    });
  }, [schedules]);

  // 날짜별로 그룹화
  const groupedSchedules = useMemo(() => {
    return sortedSchedules.reduce((acc, schedule) => {
      const dateKey = schedule.scheduleDate;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(schedule);
      return acc;
    }, {} as Record<string, ScheduleDocument[]>);
  }, [sortedSchedules]);

  /** DateGroup 컴포넌트: 날짜별 그룹 */
  const DateGroup: React.FC<{
    date: string;
    items: ScheduleDocument[];
  }> = ({ date, items }) => {
    const dateObj = new Date(date + "T00:00:00");
    const isToday = today.toDateString() === dateObj.toDateString();

    // 날짜 포맷 (YYYY년 MM월 DD일 요일)
    const formattedDate = dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

    return (
      <div className="border-l-4 border-blue-400 pl-4 space-y-4">
        <h2
          className={`text-xl font-bold ${
            isToday ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {formattedDate}{" "}
          {isToday && (
            <span className="text-sm font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">
              오늘
            </span>
          )}
        </h2>
        <div className="space-y-3">
          {items.map((schedule) => (
            <ScheduleCard
              key={schedule.scheduleId}
              schedule={schedule}
              onSelect={onSelectSchedule}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedSchedules).map(([date, items]) => (
        <DateGroup key={date} date={date} items={items} />
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 5. 컴포넌트: ScheduleDetailView (상세 뷰)
// -----------------------------------------------------------------------------

const ScheduleDetailView: React.FC<{
  schedule: ScheduleDocument;
  onBack: () => void;
}> = ({ schedule, onBack }) => {
  const scheduleDateObj = new Date(schedule.scheduleDate + "T00:00:00");
  const isPast = scheduleDateObj < today;

  // 날짜 포맷 (YYYY년 MM월 DD일 요일)
  const formattedDate = scheduleDateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 생성/업데이트 날짜 포맷
  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 font-medium p-2 -ml-2 rounded-lg hover:bg-blue-50"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        목록으로 돌아가기
      </button>

      {/* 메인 정보 헤더 */}
      <header className="border-b pb-4 space-y-2">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-gray-500 flex-shrink-0" />
          <h2 className="text-xl font-semibold text-gray-700">
            {schedule.companyName}
          </h2>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          {schedule.title}
        </h1>
      </header>

      {/* 일정 날짜 및 상태 */}
      <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
        <Calendar className="w-6 h-6 text-blue-600" />
        <div className="text-lg font-bold text-blue-800">{formattedDate}</div>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ml-auto ${
            isPast ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {isPast ? "종료된 일정" : "예정된 일정"}
        </span>
      </div>

      {/* 세부 항목 */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          세부 준비 사항
        </h3>
        <div className="space-y-4">
          {schedule.details.map((detail) => (
            <div
              key={detail.detailId}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {detail.title}
              </p>
              <p className="text-base text-gray-600 whitespace-pre-wrap">
                {detail.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 첨부 파일 */}
      {schedule.files.length > 0 && (
        <section className="space-y-4 pt-4 border-t">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            첨부 파일 ({schedule.files.length}개)
          </h3>
          <ul className="space-y-2">
            {schedule.files.map((file) => (
              <li
                key={file.fileId}
                className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-200"
              >
                <span className="text-sm font-medium text-purple-800 flex items-center">
                  <Link className="w-4 h-4 mr-2 text-purple-600" />
                  {file.originalName}
                </span>
                <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-bold transition">
                  <Download className="w-4 h-4 mr-1" />
                  다운로드 (더미)
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 메타 데이터 */}
      <footer className="pt-4 border-t text-sm text-gray-500 space-y-1">
        <p>생성일: {formatDateTime(schedule.createdDate)}</p>
        <p>최종 업데이트일: {formatDateTime(schedule.updatedDate)}</p>
        <p>
          스케줄 ID: {schedule.scheduleId} | 회사 ID: {schedule.companyId}
        </p>
      </footer>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 6. 메인 컴포넌트: JobSchedulerApp
// -----------------------------------------------------------------------------

export default function JobSchedulerApp() {
  const [schedules] = useState<ScheduleDocument[]>(MOCK_SCHEDULES);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  // 현재 선택된 스케줄 객체 찾기
  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.scheduleId === selectedScheduleId);
  }, [selectedScheduleId, schedules]);

  // 목록으로 돌아가기 핸들러
  const handleBack = () => {
    setSelectedScheduleId(null);
  };

  // 상세 보기 핸들러
  const handleSelectSchedule = (id: number) => {
    setSelectedScheduleId(id);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 min-h-screen bg-gray-50">
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl h-full max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <header className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Calendar className="w-7 h-7 mr-3 text-blue-500" />
            채용 일정 관리
          </h1>
          <p className="text-base text-gray-500 mt-1">
            {selectedSchedule
              ? "선택된 일정의 상세 정보를 확인합니다."
              : "등록된 샘플 일정을 시간 순서로 확인합니다."}
          </p>
        </header>

        {/* 본문 (목록 또는 상세 보기) */}
        {selectedSchedule ? (
          <ScheduleDetailView schedule={selectedSchedule} onBack={handleBack} />
        ) : (
          <ScheduleListView
            schedules={schedules}
            onSelectSchedule={handleSelectSchedule}
          />
        )}
      </div>
    </div>
  );
}
