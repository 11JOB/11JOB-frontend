"use client";

import React, { useState, FC, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, X, PlusCircle, FileText, Trash2 } from "lucide-react";
// 💡 Next.js 의존성 제거 및 대체 로직 사용
// import { useRouter, useSearchParams } from "next/navigation";
import { createSchedule } from "@/api/schedule"; // 💡 상대 경로로 수정
import { CreateScheduleDto } from "@/types/schedule"; // 💡 상대 경로로 수정

// ----------------------------------------------------
// Next.js 라우팅 대체 함수 (Canvas 환경 호환성 확보)
// ----------------------------------------------------
const useRouter = () => ({
  push: (path: string) => {
    // 실제 환경에서는 페이지 이동을 수행합니다.
    console.log("Navigating to:", path);
  },
});

const useSearchParams = () => {
  if (typeof window === "undefined") return { get: () => null };

  const urlParams = new URLSearchParams(window.location.search);
  return {
    get: (key: string) => urlParams.get(key),
  };
};

// ----------------------------------------------------
// 1. 유틸리티 함수 (쿼리 파라미터 파싱 시뮬레이션)
// ----------------------------------------------------
/**
 * Canvas 환경에서 쿼리 파라미터를 파싱하는 함수를 시뮬레이션합니다.
 */
const getQueryParams = () => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const params: { [key: string]: string } = {};

  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

// ----------------------------------------------------
// 2. 타입 정의
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
  files: File[]; // 💡 File[]로 변경하여 여러 파일을 지원
  companyName: string;
}

// ----------------------------------------------------
// 3. DatePickerModal 컴포넌트 (팝업 달력) - 생략 없이 그대로 유지
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

  const dayPickerClassNames = {
    nav_button: "p-2 rounded-full hover:bg-gray-200 transition duration-150",
    caption_label: "font-extrabold text-xl text-gray-800",
    day: "rounded-full p-2 text-center text-sm font-medium hover:bg-blue-100 transition duration-150",
  };

  const handleDayClick = (day: Date) => {
    onDateSelect(day);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 max-w-xs mx-auto rounded-3xl shadow-2xl relative transform transition-all duration-300 scale-100 border-t-4 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition duration-150"
          aria-label="닫기"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>

        <h3 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          일정 날짜 선택
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
            day: dayPickerClassNames.day,
            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
            day_today: "border-2 border-blue-500 text-blue-500 font-bold",
            day_outside: "text-gray-400 opacity-60",
            day_disabled: "text-gray-300 cursor-default",
          }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. 동적 세부 사항 컴포넌트 - 생략 없이 그대로 유지
// ----------------------------------------------------

interface DetailFormProps {
  detail: DetailItem;
  index: number;
  onChange: (id: number, field: "title" | "content", value: string) => void;
  onRemove: (id: number) => void;
  isRemovable: boolean;
}

const DetailForm: React.FC<DetailFormProps> = ({
  detail,
  index,
  onChange,
  onRemove,
  isRemovable,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-inner space-y-3 border border-gray-100 relative">
      <h4 className="text-base font-bold text-blue-700 mb-3">
        세부 항목 {index + 1}
      </h4>

      {isRemovable && (
        <button
          type="button"
          onClick={() => onRemove(detail.id)}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition duration-150 rounded-full hover:bg-red-50"
          aria-label="세부 항목 제거"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div>
        <label
          htmlFor={`detail-title-${detail.id}`}
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          제목 (예: 예상 질문, 필수 자료, 준비물)
        </label>
        <input
          id={`detail-title-${detail.id}`}
          type="text"
          value={detail.title}
          onChange={(e) => onChange(detail.id, "title", e.target.value)}
          placeholder={index === 0 ? "예상 질문 (면접)" : "세부 내용의 제목"}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-150"
        />
      </div>

      <div>
        <label
          htmlFor={`detail-content-${detail.id}`}
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          내용
        </label>
        <textarea
          id={`detail-content-${detail.id}`}
          rows={3}
          value={detail.content}
          onChange={(e) => onChange(detail.id, "content", e.target.value)}
          placeholder={
            index === 0 ? "1. 자기소개 2. 지원동기" : "상세 내용 입력"
          }
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-150 resize-y"
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. 메인 ScheduleRegistration 컴포넌트
// ----------------------------------------------------

export default function ScheduleRegistration() {
  const today: Date = new Date();
  const initialDetailId = 1;

  // Next.js 라우터/파라미터 대체 사용
  const router = useRouter();
  const searchParams = useSearchParams();

  // Next.js 환경이 아닌 경우를 위해 폴백
  const company = searchParams.get("company") || "";

  const [formData, setFormData] = useState<ScheduleFormData>({
    date: today,
    mainTitle: company,
    details: [{ id: initialDetailId, title: "", content: "" }],
    files: [], // 💡 파일 배열로 초기화
    companyName: company || "(기업명)",
  });

  const [nextDetailId, setNextDetailId] = useState<number>(initialDetailId + 1);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // 쿼리 파라미터 로직
  useEffect(() => {
    const params = getQueryParams();
    const company = params.company ? decodeURIComponent(params.company) : null;
    const deadline = params.deadline
      ? decodeURIComponent(params.deadline)
      : null;

    if (company) {
      setFormData((prev) => ({
        ...prev,
        companyName: company,
        mainTitle: `${company} 채용 일정`,
      }));
    }

    if (deadline) {
      const [yy, mm, dd] = deadline.split(".");
      const fullYear = parseInt(yy) < 50 ? `20${yy}` : `19${yy}`;
      const dateString = `${fullYear}-${mm}-${dd}`;

      const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

      if (parsedDate && !isNaN(parsedDate.getTime())) {
        setFormData((prev) => ({
          ...prev,
          date: parsedDate,
        }));
      } else {
        console.error("🚨 파싱된 마감일이 유효하지 않습니다:", deadline);
      }
    }
  }, []);

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

  const handleRemoveDetail = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((detail) => detail.id !== id),
    }));
  };

  // 💡 여러 파일 핸들링 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles], // 기존 파일에 추가
      }));
      // 파일 입력 필드 초기화 (같은 파일을 다시 선택할 수 있도록)
      event.target.value = "";
    }
  };

  // 💡 파일 제거 함수
  const handleRemoveFile = (fileIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
    }));
  };

  // 🚀 핵심: API 명세에 맞게 FormData를 구성하는 handleSubmit 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. DTO 객체 구성 (API 명세의 Request body > dto 필드)
    const dtoObject: CreateScheduleDto = {
      title: formData.mainTitle,
      scheduleDate: format(formData.date, "yyyy-MM-dd"), // '2025-11-22' 형식
      companyName: formData.companyName, // API 요구 사항에 맞게 추가
      details: formData.details.map((detail) => ({
        title: detail.title,
        content: detail.content,
      })),
    };

    // 2. FormData 객체 생성
    const submitFormData = new FormData();

    // 3. DTO를 JSON 문자열로 변환하여 'dto' 필드로 추가 (필수)
    submitFormData.append("dto", JSON.stringify(dtoObject));

    // 4. Multiple Files 추가
    // 백엔드는 'files' 키로 들어온 여러 파일을 배열로 처리할 것으로 가정합니다.
    formData.files.forEach((file) => {
      submitFormData.append("files", file); // 동일한 키 'files'로 모든 파일 추가
    });

    try {
      await createSchedule(submitFormData);

      // 💡 UI 알림 대신 콘솔 로그 및 페이지 이동 (Next.js 라우팅 대체)
      console.log("일정이 성공적으로 등록되었습니다.");
      router.push("/schedule/list");
    } catch (error) {
      console.error("일정 등록 중 오류 발생:", error);
      alert("일정 등록에 실패했습니다.");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl h-full max-w-4xl mx-auto border-t-8 border-blue-600">
        <header className="border-b border-gray-100 pb-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            <span className="text-blue-600">{formData.companyName}</span> 세부
            일정 등록
          </h1>
          <p className="text-base text-gray-500 mt-2">
            면접, 서류 제출, 발표 등 주요 일정을 상세하게 관리하세요.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 1. 기본 정보 섹션 */}
          <section className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-400 shadow-inner space-y-6">
            <h2 className="text-xl font-bold text-blue-700 flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>기본 일정 정보</span>
            </h2>

            {/* 날짜 */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                날짜
              </label>
              <div className="relative flex items-center max-w-sm border border-gray-300 rounded-xl p-3 bg-white shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={format(formData.date, "yyyy년 M월 d일 (EEE)", {
                    locale: ko,
                  })}
                  className="flex-1 outline-none bg-transparent text-lg text-gray-800 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="p-2 ml-3 rounded-full text-blue-500 hover:bg-blue-100 transition duration-150"
                  aria-label="달력 열기"
                >
                  <Calendar className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDateSelect(today)}
                  className="p-2 ml-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition duration-150"
                  aria-label="오늘 날짜로 초기화"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                일정 제목
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
                placeholder={`${formData.companyName}의 면접, 서류 제출, 혹은 마감일`}
                className="w-full border border-gray-300 rounded-xl p-3 text-lg text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-150 shadow-sm"
              />
            </div>
          </section>

          {/* 2. 세부 사항 섹션 (동적 생성) */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>세부 준비 항목</span>
              <button
                type="button"
                onClick={handleAddDetail}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition duration-150 shadow-md shadow-blue-200"
                aria-label="세부 항목 추가"
              >
                <PlusCircle className="w-4 h-4" />
                <span>항목 추가</span>
              </button>
            </h2>

            <div className="space-y-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {formData.details.map((detail, index) => (
                <DetailForm
                  key={detail.id}
                  detail={detail}
                  index={index}
                  onChange={handleDetailChange}
                  onRemove={handleRemoveDetail}
                  isRemovable={formData.details.length > 1} // 최소 1개는 유지
                />
              ))}
            </div>
          </section>

          {/* 3. 파일 업로드 섹션 (다중 파일 지원) */}
          <section className="p-6 bg-gray-50 rounded-xl border-l-4 border-gray-400 space-y-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>참고 파일 업로드 (다중 파일 지원)</span>
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 relative">
              {/* 파일 인풋 */}
              <input
                id="file-upload"
                type="file"
                multiple // 💡 multiple 속성 추가
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="파일 선택"
              />
              <p className="mb-4">
                이력서, 포트폴리오 등 관련 파일을 선택하거나 드래그 앤
                드롭하세요.
              </p>
              <label
                htmlFor="file-upload"
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150 inline-block cursor-pointer shadow-sm"
              >
                파일 선택/추가
              </label>

              {/* 선택된 파일 목록 */}
              {formData.files.length > 0 && (
                <div className="mt-6 space-y-2 text-left bg-white p-4 rounded-lg border border-gray-100">
                  <p className="font-semibold text-gray-700">
                    선택된 파일 ({formData.files.length}개)
                  </p>
                  {formData.files.map((file, index) => (
                    <div
                      key={index} // file.name + index를 키로 사용
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-100"
                    >
                      <span className="truncate max-w-[80%]">
                        {file.name} ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition duration-150"
                        aria-label={`파일 ${file.name} 제거`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 등록 버튼 */}
          <div className="flex justify-center pt-8 border-t border-gray-100">
            <button
              type="submit"
              className="w-full max-w-sm px-8 py-4 bg-orange-500 text-white text-xl font-extrabold rounded-full hover:bg-orange-600 transition duration-150 shadow-2xl shadow-orange-300 transform hover:scale-[1.02] active:scale-100"
            >
              🚀 일정 등록 완료
            </button>
          </div>
        </form>
      </div>

      {/* 날짜 선택 팝업 컴포넌트 */}
      <DatePickerModal
        selectedDate={formData.date}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}

// 💡 파일 크기 포맷 유틸리티
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
