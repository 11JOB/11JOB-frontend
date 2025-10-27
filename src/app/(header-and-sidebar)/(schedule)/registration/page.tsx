"use client";

import React, { useState, FC } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// ----------------------------------------------------
// 1. 타입 정의 (이전과 동일)
// ----------------------------------------------------

interface DetailItem {
  id: number;
  title: string;
  content: string;
}
interface ScheduleFormData {
  date: Date;
  mainTitle: string;
  details: DetailItem[];
  file: File | null;
}

// ----------------------------------------------------
// 2. DatePickerModal 컴포넌트 (팝업 달력) - 스타일 개선
// ----------------------------------------------------

interface DatePickerModalProps {
  selectedDate: Date;
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const DatePickerModal: FC<DatePickerModalProps> = ({
  selectedDate,
  isOpen,
  onClose,
  onDateSelect,
}) => {
  if (!isOpen) return null;

  // DayPicker 스타일링
  const dayPickerClassNames = {
    nav_button: "p-2 rounded-full hover:bg-gray-200 transition duration-150",
    caption_label: "font-extrabold text-xl text-gray-800",
    day: "rounded-full p-2 text-center text-sm font-medium hover:bg-blue-100 transition duration-150",
  };

  const handleDayClick = (day: Date) => {
    onDateSelect(day);
    onClose(); // 날짜 선택 후 팝업 닫기
  };

  return (
    // ⚠️ 수정: 모달 오버레이를 더 어둡게 (bg-opacity-70)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5D5D5DB2] "
      onClick={onClose}
    >
      {/* ⚠️ 수정: 모달 컨테이너 크기 및 그림자/둥글기 조정 */}
      <div
        className="bg-white p-6 max-w-xs mx-auto rounded-2xl shadow-xl relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼을 모달 상단 오른쪽에 배치 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition duration-150"
          aria-label="닫기"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
          날짜 선택
        </h3>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onDayClick={handleDayClick}
          locale={ko}
          classNames={{
            root: "w-full",
            caption: "flex justify-between items-center mb-4 px-2",
            caption_label: dayPickerClassNames.caption_label,
            nav_button_previous: dayPickerClassNames.nav_button,
            nav_button_next: dayPickerClassNames.nav_button,
            head_cell: "text-gray-500 font-semibold text-sm pt-2 pb-1",
            // ⚠️ 수정: 날짜 셀에 hover 스타일 및 선택 시 파란색 배경 적용
            day: dayPickerClassNames.day,
            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
            day_today: "border border-blue-500 text-blue-500 font-bold",
            day_outside: "text-gray-400",
            day_disabled: "text-gray-300 cursor-default",
          }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. 동적 세부 사항 컴포넌트 (생략 - 이전과 동일)
// ----------------------------------------------------

interface DetailFormProps {
  detail: DetailItem;
  index: number;
  onChange: (id: number, field: "title" | "content", value: string) => void;
}

const DetailForm: React.FC<DetailFormProps> = ({ detail, index, onChange }) => {
  // 이전 코드의 DetailForm 로직
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
      {/* 제목 */}
      <div>
        <label
          htmlFor={`detail-title-${detail.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          제목
        </label>
        <input
          id={`detail-title-${detail.id}`}
          type="text"
          value={detail.title}
          onChange={(e) => onChange(detail.id, "title", e.target.value)}
          placeholder={index === 0 ? "예상 질문" : "Value"}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 내용 */}
      <div>
        <label
          htmlFor={`detail-content-${detail.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          내용
        </label>
        <input
          id={`detail-content-${detail.id}`}
          type="text"
          value={detail.content}
          onChange={(e) => onChange(detail.id, "content", e.target.value)}
          placeholder={index === 0 ? "1. ~~" : "Value"}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. 메인 ScheduleRegistration 컴포넌트 (생략 - 이전과 동일)
// ----------------------------------------------------

export default function ScheduleRegistration() {
  const today: Date = new Date();
  const initialDetailId = 1;

  const [formData, setFormData] = useState<ScheduleFormData>({
    date: today,
    mainTitle: "",
    details: [{ id: initialDetailId, title: "", content: "" }],
    file: null,
  });

  const [nextDetailId, setNextDetailId] = useState<number>(initialDetailId + 1);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({ ...prev, date: date }));
  };

  const handleDetailChange = (
    id: number,
    field: "title" | "content",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  const handleAddDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { id: nextDetailId, title: "", content: "" }],
    }));
    setNextDetailId((prev) => prev + 1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("폼 제출 데이터:", formData);
    alert("일정이 등록되었습니다! (콘솔 확인)");
  };

  return (
    <div className="flex-1 p-8">
      <div className="bg-white p-10 rounded-xl shadow-lg h-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 border-b border-gray-200 pb-2 mb-6">
          (기업명)의 세부 일정 등록하기
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          기업별 취업 일정을 등록해보세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. 날짜 및 제목 섹션 */}
          <div className="space-y-6">
            {/* 날짜 */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                날짜
              </label>
              <div className="relative flex items-center w-64 border border-gray-300 rounded-lg p-3">
                <input
                  type="text"
                  readOnly
                  value={format(formData.date, "dd.MM.yyyy")}
                  className="flex-1 outline-none bg-transparent text-lg text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 cursor-pointer ml-2 hover:text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 12h14M5 16h14M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDateSelect(today)}
                  className="p-1 ml-1 text-gray-400 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={formData.mainTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mainTitle: e.target.value,
                  }))
                }
                placeholder="캘린더에 나올 일정 제목"
                className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2. 세부 사항 섹션 (동적 생성) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">세부 사항</h2>

            <div className="space-y-4">
              {formData.details.map((detail, index) => (
                <DetailForm
                  key={detail.id}
                  detail={detail}
                  index={index}
                  onChange={handleDetailChange}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddDetail}
                className="text-sm text-blue-500 font-semibold hover:text-blue-700 transition duration-150"
              >
                + 추가하기
              </button>
            </div>
          </div>

          {/* 3. 파일 업로드 섹션 (생략) */}
          {/* ... */}

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition duration-150"
            >
              일정 등록 완료
            </button>
          </div>
        </form>
      </div>

      {/* 💡 날짜 선택 팝업 컴포넌트 */}
      <DatePickerModal
        selectedDate={formData.date}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}
