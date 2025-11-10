"use client";

import React, { FC, useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  //   getDay,
  getDate,
  //   getDaysInMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 아이콘 사용

// Calendar data interface
interface EventItem {
  text: string;
  color: string;
}

interface CurrentMonthEvents {
  [key: string]: EventItem[];
}

// 캘린더 더미 이벤트 데이터 (2025년 10월, 11월 기준)
const eventData: CurrentMonthEvents = {
  // 10월 이벤트
  "2025-10-27": [
    { text: "금융 자문 회의", color: "bg-yellow-200" },
    { text: "할 일 마감", color: "bg-red-200" },
    { text: "추가 미팅", color: "bg-green-200" },
  ],
  "2025-10-29": [{ text: "면접 w/ Figma", color: "bg-pink-200" }],
  "2025-10-31": [
    { text: "할로윈 파티", color: "bg-blue-200" },
    { text: "발표 준비", color: "bg-purple-200" },
    { text: "팀 회의", color: "bg-indigo-200" },
  ],
  // 11월 이벤트
  "2025-11-03": [{ text: "미팅 w/ Mac", color: "bg-pink-200" }],
  "2025-11-05": [{ text: "프로젝트 마감", color: "bg-red-400" }],
  "2025-11-10": [{ text: "중요 면접", color: "bg-teal-200" }],
  "2025-11-20": [{ text: "개발 컨퍼런스", color: "bg-blue-300" }],
};

const getDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

// 캘린더 헤더 컴포넌트
interface HeaderProps {
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}

const CalendarHeader: FC<HeaderProps> = ({
  currentMonth,
  prevMonth,
  nextMonth,
}) => {
  return (
    <div className="flex justify-between items-center mb-6 px-2">
      <button
        onClick={prevMonth}
        className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition duration-200 w-10 h-10 flex items-center justify-center"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h2 className="font-bold text-3xl text-gray-800 select-none">
        {format(currentMonth, "yyyy년 M월", { locale: ko })}
      </h2>
      <button
        onClick={nextMonth}
        className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition duration-200 w-10 h-10 flex items-center justify-center"
        aria-label="Next month"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// 캘린더 날짜 계산 로직
const useCalendarData = (currentMonth: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ko, weekStartsOn: 0 }); // 일요일부터 시작
    const endDate = endOfWeek(monthEnd, { locale: ko, weekStartsOn: 0 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = new Date(day.setDate(day.getDate() + 1));
      }
    }
    return days;
  }, [currentMonth]);
};

// 캘린더 셀 (Day) 컴포넌트
interface DayCellProps {
  day: Date;
  currentMonth: Date;
  today: Date;
}

const DayCell: FC<DayCellProps> = ({ day, currentMonth, today }) => {
  const key = getDateKey(day);
  const events: EventItem[] = eventData[key] || [];

  const isOutside = !isSameMonth(day, currentMonth);
  const isToday = isSameDay(day, today);

  // 날짜 스타일링
  const dateClasses = `
        absolute top-1 left-2 text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-200
        ${
          isOutside
            ? "text-gray-400"
            : isToday
            ? "bg-orange-500 text-white shadow-lg z-10"
            : "text-gray-800 hover:bg-gray-100"
        }
    `;

  // 셀 배경 및 경계 스타일링
  const cellClasses = `
        align-top p-0.5 relative border border-gray-100 bg-white min-h-24 transition-colors duration-300
        ${isOutside ? "bg-gray-50 opacity-70" : "hover:bg-indigo-50"}
    `;

  return (
    <div className={cellClasses} style={{ height: "120px" }}>
      {/* 날짜 번호 */}
      <span className={dateClasses}>{getDate(day)}</span>

      {/* 이벤트 목록 */}
      <div className="flex flex-col gap-0.5 mt-8 px-1 h-[calc(100%-32px)] overflow-hidden">
        {events.slice(0, 3).map((event: EventItem, i: number) => (
          <div
            key={i}
            className={`text-[10px] truncate rounded-sm px-1.5 py-0.5 ${event.color} text-gray-800 font-normal shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer`}
            style={{ lineHeight: "1.2" }}
            title={event.text}
          >
            {event.text}
          </div>
        ))}
        {events.length > 3 && (
          <span className="text-xs text-indigo-500 hover:text-indigo-600 font-normal cursor-pointer mt-1 px-1">
            + {events.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const today: Date = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

  // 달력 데이터 계산
  const calendarDays = useCalendarData(currentMonth);

  // 네비게이션 함수
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 요일 이름 배열
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl h-full max-w-6xl mx-auto">
        <header className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
            취업 일정 달력
          </h1>
          <h2 className="text-lg font-medium text-gray-700 mt-2">
            오늘 날짜:{" "}
            <span className="text-orange-600 font-semibold">
              {format(today, "yyyy년 MM월 dd일 EEEE", { locale: ko })}
            </span>
          </h2>
        </header>

        {/* 캘린더 네비게이션 */}
        <CalendarHeader
          currentMonth={currentMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />

        {/* 캘린더 테이블 */}
        <div className="shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 bg-indigo-600 text-white font-medium text-center">
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className={`py-3 text-sm uppercase tracking-wider ${
                  index === 0
                    ? "text-red-300"
                    : index === 6
                    ? "text-blue-300"
                    : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 border-t border-gray-200">
            {calendarDays.map((day, index) => (
              <DayCell
                key={index}
                day={day}
                currentMonth={currentMonth}
                today={today}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
