"use client";
// 전체 너비를 정하고, 거기서 패딩을 주어 내부 여백을 만들게끔 해야 함
// 달력 너비 1262
import React, { FC } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface EventItem {
  text: string;
  color: string;
}

interface CurrentMonthEvents {
  [key: string]: EventItem[];
}

interface CustomDayContentProps {
  date: Date;
  displayMonth: Date;
}

const dayPickerClassNames: { [key: string]: string } = {
  nav_button:
    "flex items-center justify-center p-2 rounded-full hover:bg-gray-100",
  caption_label: "font-extrabold text-2xl text-gray-800",
  head_cell: "text-gray-500 font-medium text-sm pt-4 pb-2",
  cell: "h-32 align-top p-1 relative",
  day: "w-full h-full rounded-lg hover:bg-gray-100 p-10 justify-center items-center",
};

const currentMonthEvents: CurrentMonthEvents = {
  // 현재 날짜(2025년 10월)에 맞춘 더미 이벤트 데이터
  "2025-10-27": [
    { text: "금융 자문 회의", color: "bg-yellow-200" },
    { text: "할 일 마감", color: "bg-red-200" },
  ],
  "2025-10-29": [{ text: "면접 w/ Figma", color: "bg-pink-200" }],
  "2025-10-31": [{ text: "할로윈 파티", color: "bg-blue-200" }],
  "2025-11-03": [{ text: "미팅 w/ Mac", color: "bg-pink-200" }],
};

const getDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

const DayContentWithEvents: FC<CustomDayContentProps> = ({
  date,
  displayMonth,
}) => {
  const key: string = getDateKey(date);
  const events: EventItem[] = currentMonthEvents[key] || [];

  const isOutside: boolean = date.getMonth() !== displayMonth.getMonth();

  return (
    <div className="flex flex-col h-full w-full">
      {/* 날짜 번호 */}
      <span
        className={`text-xs p-1 ${
          isOutside ? "text-gray-400" : "text-gray-800 font-semibold"
        }`}
      >
        {date.getDate()}
      </span>

      <div className="flex flex-col gap-1 mt-1 px-1 overflow-hidden">
        {events.slice(0, 2).map((event: EventItem, i: number) => (
          <div
            key={i}
            className={`text-[10px] truncate rounded-sm px-1 py-0.5 ${event.color} text-gray-800 font-medium`}
            style={{ lineHeight: "100%" }}
          >
            {event.text}
          </div>
        ))}
        {events.length > 2 && (
          <span className="text-xs text-blue-500 hover:underline cursor-pointer">
            view more
          </span>
        )}
      </div>
    </div>
  );
};

export default function MainPage() {
  const today: Date = new Date();

  return (
    <div className="flex-1 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg h-full">
        <div className="mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-700">
            오늘 날짜:{" "}
            <span className="text-orange-500">
              {format(today, "yyyy년 MM월 dd일 EEEE", { locale: ko })}
            </span>
          </h2>
        </div>

        <div className="w-[80%]">
          <DayPicker
            mode="single"
            month={today}
            showOutsideDays={true}
            locale={ko}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            components={{ DayContent: DayContentWithEvents } as any}
            formatters={{
              formatCaption: (date: Date) =>
                format(date, "MMMM yyyy", { locale: ko }),
            }}
            classNames={{
              root: "w-full",
              caption: "flex justify-between items-center mb-10 px-2",
              caption_label: dayPickerClassNames.caption_label,
              nav: "flex space-x-2",
              // nav_button 클래스 결합 시 공백 추가
              nav_button_previous: dayPickerClassNames.nav_button + " w-8 h-8",
              nav_button_next: dayPickerClassNames.nav_button + " w-8 h-8",

              months: "w-full",
              month: "w-full",
              // 달력 그리드를 위한 table-fixed 적용
              table: "w-full border-collapse table-fixed",
              head: "border-b",

              // 요일 헤더 스타일링
              head_cell:
                "w-[calc(100%/7)] text-gray-500 font-bold text-base pt-4 pb-2 text-center",
              row: "w-full",
              // 셀 경계선 및 높이 설정
              cell: "h-32 align-top p-1 relative border-r last:border-r-0 border-b",
              day: dayPickerClassNames.day,
            }}
          />
        </div>
      </div>
    </div>
  );
}
