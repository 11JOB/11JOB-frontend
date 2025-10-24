"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// DayPicker의 스타일을 Tailwind CSS로 덮어쓰기 위한 클래스 객체
const dayPickerClassNames = {
  nav_button:
    "flex items-center justify-center p-2 rounded-full hover:bg-gray-100",
  caption_label: "font-extrabold text-2xl text-gray-800",
  head_cell: "text-gray-500 font-medium text-sm pt-4 pb-2",
  cell: "h-24 align-top p-1 relative",
  day: "w-full h-full text-center text-gray-700 focus:outline-none",
};

export default function MainPage() {
  const today = new Date(); // 현재 날짜와 시간 정보를 가져옵니다.

  return (
    <div className="flex-1 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg h-full">
        {/* 1. 오늘 날짜 표시 영역 추가 */}
        <div className="mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-700">
            오늘 날짜:{" "}
            <span className="text-orange-500">
              {format(today, "yyyy년 MM월 dd일 EEEE", { locale: ko })}
            </span>
          </h2>
        </div>

        {/* 2. 캘린더 영역 (현재 달 표시) */}
        <div className="w-full">
          <DayPicker
            mode="single"
            // today를 month prop에 전달하여 현재 달의 달력을 표시합니다.
            month={today}
            showOutsideDays={true}
            locale={ko}
            // 이미지와 같은 'Month YYYY' 형식의 헤더 스타일링
            formatters={{
              formatCaption: (date) =>
                format(date, "MMMM yyyy", { locale: ko }),
            }}
            classNames={{
              root: "w-full",
              caption: "flex justify-between items-center mb-6 px-2",
              caption_label: dayPickerClassNames.caption_label,
              nav: "flex space-x-2",
              nav_button_previous: dayPickerClassNames.nav_button,
              nav_button_next: dayPickerClassNames.nav_button,
              months: "w-full",
              month: "w-full",
              table: "w-full border-collapse",
              head: "border-b",
              head_row: "w-full",
              head_cell: dayPickerClassNames.head_cell,
              row: "w-full",
              cell: dayPickerClassNames.cell,
            }}
          />
        </div>
      </div>
    </div>
  );
}
