"use client";

import React, { FC, useState, useMemo, useEffect } from "react";
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
  getDate,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ API
import { getScheduleList } from "@/api/schedule";
import type { Schedule } from "@/types/schedule";

// -----------------------------------------------------------------------------
// 타입 정의
// -----------------------------------------------------------------------------

// 캘린더에 표시할 이벤트 1개
interface EventItem {
  scheduleId: number; // ✅ 클릭 시 상세 이동에 사용할 ID
  text: string;
  color: string;
}

// 날짜(yyyy-MM-dd)별 이벤트 리스트
interface CurrentMonthEvents {
  [key: string]: EventItem[];
}

const getDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

// -----------------------------------------------------------------------------
// 캘린더 헤더
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// 캘린더 날짜 계산 로직
// -----------------------------------------------------------------------------

const useCalendarData = (currentMonth: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ko, weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { locale: ko, weekStartsOn: 0 });

    const days: Date[] = [];
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

// -----------------------------------------------------------------------------
// DayCell
// -----------------------------------------------------------------------------

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  today: Date;
  eventsByDate: CurrentMonthEvents;
  onEventClick: (scheduleId: number) => void;
}

const DayCell: FC<DayCellProps> = ({
  day,
  currentMonth,
  today,
  eventsByDate,
  onEventClick,
}) => {
  const key = getDateKey(day);
  const events: EventItem[] = eventsByDate[key] || [];

  const isOutside = !isSameMonth(day, currentMonth);
  const isToday = isSameDay(day, today);

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
        {events.slice(0, 3).map((event, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onEventClick(event.scheduleId)}
            className={`text-[10px] text-left truncate rounded-sm px-1.5 py-0.5 ${event.color} text-gray-800 font-normal shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer`}
            style={{ lineHeight: "1.2" }}
            title={event.text}
          >
            {event.text}
          </button>
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

// -----------------------------------------------------------------------------
// 메인 컴포넌트
// -----------------------------------------------------------------------------

export default function App() {
  const router = useRouter();
  const today: Date = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

  const [eventsByDate, setEventsByDate] = useState<CurrentMonthEvents>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarDays = useCalendarData(currentMonth);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // ✅ 일정 로딩
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        const list: Schedule[] = await getScheduleList({ page: 0, size: 200 });

        const map: CurrentMonthEvents = {};

        list.forEach((s) => {
          if (!s.scheduleDate) return;

          const dateObj = new Date(`${s.scheduleDate}T00:00:00`);

          // 현재 달만 보여주기
          if (
            dateObj.getFullYear() !== currentMonth.getFullYear() ||
            dateObj.getMonth() !== currentMonth.getMonth()
          ) {
            return;
          }

          const key = s.scheduleDate;
          if (!map[key]) map[key] = [];

          map[key].push({
            scheduleId: s.scheduleId, // ✅ 여기!
            text: `${s.companyName} - ${s.title}`,
            color: "bg-indigo-100",
          });
        });

        setEventsByDate(map);
      } catch (err) {
        console.error("❌ 달력 일정 조회 실패:", err);
        setError("달력 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [currentMonth]);

  // ✅ 이벤트 클릭 시 상세 페이지로 이동
  const handleEventClick = (scheduleId: number) => {
    // 필요에 따라 경로 수정: /schedule/view?scheduleId=... 기준
    router.push(`/view?scheduleId=${scheduleId}`);
  };

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
          {loading && (
            <p className="mt-3 text-sm text-gray-500">
              달력 데이터를 불러오는 중입니다...
            </p>
          )}
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </header>

        <CalendarHeader
          currentMonth={currentMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />

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
                eventsByDate={eventsByDate}
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
