"use client";

import React, { useState, FC, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, X, PlusCircle, FileText, Trash2 } from "lucide-react";

import { createSchedule } from "@/api/schedule";
import { CreateScheduleDto, SelectedJob } from "@/types/schedule";

// --------------------
// 라우터 대체(기존 유지)
// --------------------
const useRouter = () => ({
  push: (path: string) => {
    window.location.href = path;
  },
});

// --------------------
// 타입
// --------------------
interface DetailItem {
  id: number; // 프론트에서만 쓰는 id (detailId로 전송)
  title: string;
  content: string;
}

interface ScheduleFormData {
  date: Date;
  mainTitle: string;
  details: DetailItem[];
  files: File[];
  companyName: string;
}

// --------------------
// DatePickerModal
// --------------------
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 max-w-xs mx-auto rounded-3xl shadow-2xl relative border-t-4 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>

        <h3 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          일정 날짜 선택
        </h3>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onDayClick={(day) => {
            onDateSelect(day);
            onClose();
          }}
          locale={ko}
          classNames={{
            root: "w-full",
            caption: "flex justify-between items-center mb-4 px-2",
            caption_label: "font-extrabold text-xl text-gray-800",
            nav_button_previous: "p-2 rounded-full hover:bg-gray-200",
            nav_button_next: "p-2 rounded-full hover:bg-gray-200",
            head_cell: "text-gray-500 font-semibold text-sm pt-2 pb-1",
            day: "rounded-full p-2 text-center text-sm font-medium hover:bg-blue-100",
            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
            day_today: "border-2 border-blue-500 text-blue-500 font-bold",
            day_outside: "text-gray-400 opacity-60",
          }}
        />
      </div>
    </div>
  );
};

// --------------------
// DetailForm
// --------------------
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
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          제목
        </label>
        <input
          type="text"
          value={detail.title}
          onChange={(e) => onChange(detail.id, "title", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          내용
        </label>
        <textarea
          rows={3}
          value={detail.content}
          onChange={(e) => onChange(detail.id, "content", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 resize-y"
        />
      </div>
    </div>
  );
};

// --------------------
// 메인
// --------------------
export default function ScheduleRegistration() {
  const today = new Date();
  const initialDetailId = 1;
  const router = useRouter();

  const [formData, setFormData] = useState<ScheduleFormData>({
    date: today,
    mainTitle: "",
    details: [{ id: initialDetailId, title: "", content: "" }],
    files: [],
    companyName: "(기업명)",
  });

  const [nextDetailId, setNextDetailId] = useState(initialDetailId + 1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [hasSelectedJob, setHasSelectedJob] = useState(true);

  // ✅ selectedJob 자동 채움
  useEffect(() => {
    const raw = sessionStorage.getItem("selectedJob");
    if (!raw) {
      setHasSelectedJob(false);
      return;
    }

    try {
      const job: SelectedJob = JSON.parse(raw);

      setFormData((prev) => ({
        ...prev,
        companyName: job.companyName,
        mainTitle: `${job.companyName} - ${job.title}`,
      }));

      if (job.expirationDate) {
        const parsedDate = parse(job.expirationDate, "yyyy-MM-dd", new Date());
        if (!isNaN(parsedDate.getTime())) {
          setFormData((prev) => ({ ...prev, date: parsedDate }));
        }
      }
    } catch (e) {
      console.error("selectedJob 파싱 실패:", e);
      setHasSelectedJob(false);
    }
  }, []);

  const handleDateSelect = (date: Date) =>
    setFormData((prev) => ({ ...prev, date }));

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((f) => f instanceof File);

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...fileArray],
    }));

    event.target.value = "";
  };

  const handleRemoveFile = (fileIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // ✅ Swagger dto 구조 그대로
    const dtoObject: CreateScheduleDto = {
      companyName: formData.companyName,
      title: formData.mainTitle,
      scheduleDate: format(formData.date, "yyyy-MM-dd"),
      details: formData.details.map((detail) => ({
        detailId: detail.id,
        title: detail.title,
        content: detail.content,
      })),
      filesToDelete: [],
    };

    const submitFormData = new FormData();

    // ✅ 핵심: dto를 JSON Blob으로 append (Swagger처럼 application/json 파트로 인식)
    submitFormData.append(
      "dto",
      new Blob([JSON.stringify(dtoObject)], { type: "application/json" })
    );

    formData.files.forEach((file) => {
      submitFormData.append("files", file);
    });

    // 디버깅 (서버에서 dto가 JSON으로 들어오는지 확인할 때 유용)
    for (const [k, v] of submitFormData.entries()) {
      console.log("FormData:", k, v);
    }

    try {
      await createSchedule(submitFormData);
      router.push("/schedule/list");
    } catch (error) {
      console.error("일정 등록 중 오류 발생:", error);
      alert("일정 등록에 실패했습니다.");
    }
  };

  if (!hasSelectedJob) {
    return (
      <div className="flex-1 p-8 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
          <p className="text-xl font-bold text-gray-800">
            선택된 채용 공고가 없습니다.
          </p>
          <p className="text-gray-500">
            채용 공고 리스트에서 “세부 일정 등록” 버튼을 눌러 들어와 주세요.
          </p>
          <button
            onClick={() => router.push("/list")}
            className="px-5 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            공고 리스트로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl h-full max-w-4xl mx-auto border-t-8 border-blue-600">
        <header className="border-b border-gray-100 pb-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            <span className="text-blue-600">{formData.companyName}</span> 세부
            일정 등록
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 기본 정보 */}
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
                  className="p-2 ml-3 rounded-full text-blue-500 hover:bg-blue-100"
                >
                  <Calendar className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDateSelect(today)}
                  className="p-2 ml-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
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
                className="w-full border border-gray-300 rounded-xl p-3 text-lg"
              />
            </div>
          </section>

          {/* 세부 항목 */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 flex justify-between items-center">
              <span>세부 준비 항목</span>
              <button
                type="button"
                onClick={handleAddDetail}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full hover:bg-blue-600 shadow-md shadow-blue-200"
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
                  isRemovable={formData.details.length > 1}
                />
              ))}
            </div>
          </section>

          {/* 파일 업로드 */}
          <section className="p-6 bg-gray-50 rounded-xl border-l-4 border-gray-400 space-y-4">
            <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>참고 파일 업로드 (다중 파일 지원)</span>
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 relative">
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              <p className="mb-4">
                이력서, 포트폴리오 등 관련 파일을 선택하세요.
              </p>

              <label
                htmlFor="file-upload"
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 inline-block cursor-pointer"
              >
                파일 선택/추가
              </label>

              {formData.files.length > 0 && (
                <div className="mt-6 space-y-2 text-left bg-white p-4 rounded-lg border">
                  <p className="font-semibold text-gray-700">
                    선택된 파일 ({formData.files.length}개)
                  </p>

                  {formData.files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm text-gray-700 border"
                    >
                      <span className="truncate max-w-[80%]">
                        {file.name} ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 제출 */}
          <div className="flex justify-center pt-8 border-t border-gray-100">
            <button
              type="submit"
              className="w-full max-w-sm px-8 py-4 bg-orange-500 text-white text-xl font-extrabold rounded-full hover:bg-orange-600 shadow-2xl shadow-orange-300"
            >
              🚀 일정 등록 완료
            </button>
          </div>
        </form>
      </div>

      <DatePickerModal
        selectedDate={formData.date}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}

// 파일 크기 포맷
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
