"use client";

import React, { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  LinkIcon,
  AlignLeft,
} from "lucide-react";

// --- 1. 타입 정의 ---

interface DateFields {
  year: string;
  month: string;
  day: string;
}

interface ProjectItem {
  id: string;
  title: string;
  startDate: DateFields;
  endDate: DateFields;
  description: string;
  link: string;
  isNew: boolean; // 새로 추가된 항목인지 여부
}

// 초기 빈 프로젝트 항목 생성 함수
const createNewProject = (): ProjectItem => ({
  id: crypto.randomUUID(), // 임시 ID
  title: "",
  startDate: { year: "", month: "", day: "" },
  endDate: { year: "", month: "", day: "" },
  description: "",
  link: "",
  isNew: true,
});

// --- 2. 서브 컴포넌트: 날짜 입력 그룹 ---

const DateInput: React.FC<{
  placeholder: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  className?: string;
}> = ({ placeholder, value, maxLength, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) =>
      onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength))
    }
    className={`w-full p-2 border border-gray-300 rounded-md text-center focus:ring-indigo-500 focus:border-indigo-500 text-sm transition ${className}`}
    maxLength={maxLength}
  />
);

const DateInputGroup: React.FC<{
  date: DateFields;
  onChange: (fields: Partial<DateFields>) => void;
  label: string;
}> = ({ date, onChange, label }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-xs font-semibold text-gray-500 flex items-center">
      <Calendar size={12} className="mr-1 text-indigo-400" />
      {label}
    </label>
    <div className="flex items-center space-x-1">
      <DateInput
        placeholder="YYYY"
        value={date.year}
        maxLength={4}
        onChange={(year) => onChange({ year })}
      />
      <span className="text-gray-400">/</span>
      <DateInput
        placeholder="MM"
        value={date.month}
        maxLength={2}
        onChange={(month) => onChange({ month })}
      />
      <span className="text-gray-400">/</span>
      <DateInput
        placeholder="DD"
        value={date.day}
        maxLength={2}
        onChange={(day) => onChange({ day })}
      />
    </div>
  </div>
);

// --- 3. 서브 컴포넌트: 프로젝트 항목 카드 ---

const ProjectItemCard: React.FC<{
  item: ProjectItem;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onDelete: (id: string) => void;
  onSave: (item: ProjectItem) => void;
}> = ({ item, onUpdate, onDelete, onSave }) => {
  const handleDateChange =
    (type: "start" | "end") => (fields: Partial<DateFields>) => {
      const key = type === "start" ? "startDate" : "endDate";
      onUpdate(item.id, { [key]: { ...item[key], ...fields } });
    };

  // 모든 날짜 필드가 비어있지 않은지 검사
  const isDateValid = (d: DateFields) =>
    d.year.length === 4 && d.month.length > 0 && d.day.length > 0;

  const isFilled =
    item.title.trim().length > 0 &&
    item.description.trim().length > 0 &&
    isDateValid(item.startDate) &&
    isDateValid(item.endDate);

  const InputField: React.FC<{
    label: string;
    placeholder: string;
    value: string;
    field: keyof ProjectItem;
    icon: React.ReactNode;
    type?: string;
  }> = ({ label, placeholder, value, field, icon, type = "text" }) => (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
        {icon}
        <span className="ml-1">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onUpdate(item.id, { [field]: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
    </div>
  );

  return (
    <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 mb-6 border border-indigo-100">
      {/* 타이틀 및 Placeholder */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6 items-start">
        {/* 이미지 Placeholder (카드 상단 디자인 요소) */}
        <div className="w-20 h-20 bg-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
          Image
        </div>

        <div className="flex-1 w-full">
          <InputField
            label="프로젝트 제목"
            placeholder="제목을 입력하세요 (예: 커뮤니티 웹 서비스 개발)"
            value={item.title}
            field="title"
            icon={<AlignLeft size={16} className="text-indigo-600" />}
          />
        </div>
      </div>

      {/* 날짜 입력 (Start ~ End) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <DateInputGroup
          label="시작 일자"
          date={item.startDate}
          onChange={handleDateChange("start")}
        />
        <DateInputGroup
          label="종료 일자"
          date={item.endDate}
          onChange={handleDateChange("end")}
        />
      </div>

      {/* 설명 (Description) */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
          <AlignLeft size={16} className="text-indigo-600" />
          <span className="ml-1">상세 설명</span>
        </label>
        <textarea
          placeholder="진행한 프로젝트에 대한 상세 내용을 입력하세요. (사용 기술, 역할, 성과 등)"
          value={item.description}
          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y transition shadow-sm"
        />
      </div>

      {/* 링크 (Link) */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
          <LinkIcon size={16} className="text-indigo-600" />
          <span className="ml-1">프로젝트 링크 (선택 사항)</span>
        </label>
        <input
          type="url"
          placeholder="GitHub, Demo URL, Notion 등 연결 링크"
          value={item.link}
          onChange={(e) => onUpdate(item.id, { link: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-3 border-t pt-4">
        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition duration-150 shadow-md transform hover:scale-[1.02]"
        >
          <Trash2 size={16} />
          <span>삭제</span>
        </button>

        {/* 저장/업데이트 버튼 */}
        <button
          onClick={() => onSave(item)}
          disabled={!isFilled}
          className={`flex items-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl transition duration-150 shadow-lg transform hover:scale-[1.02] ${
            isFilled
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Save size={16} />
          <span>{item.isNew ? "저장하기" : "업데이트"}</span>
        </button>
      </div>
    </div>
  );
};

// --- 4. 메인 컴포넌트 ---

export default function ProjectRegisterPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([createNewProject()]);
  const [isSaving, setIsSaving] = useState(false);

  // 프로젝트 항목 추가
  const handleAddProject = useCallback(() => {
    setProjects((prev) => [...prev, createNewProject()]);
  }, []);

  // 프로젝트 항목 업데이트
  const handleUpdateProject = useCallback(
    (id: string, updates: Partial<ProjectItem>) => {
      setProjects((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  // 프로젝트 항목 삭제
  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
    console.log(`[Data Action] Project ID ${id} 삭제 요청`);
  }, []);

  // 프로젝트 항목 저장
  const handleSaveProject = useCallback(async (project: ProjectItem) => {
    if (!project.title || !project.description) {
      console.error("제목과 설명은 필수 입력 사항입니다.");
      return;
    }

    setIsSaving(true);
    try {
      // NOTE: 실제 앱에서는 setDoc/addDoc 호출 필요
      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id ? { ...project, isNew: false } : item
        )
      );
      console.log(`[Data Action] Project ID ${project.id} 저장/업데이트 완료`);
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-600">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
            프로젝트 등록 및 관리
          </h1>
          <p className="text-gray-500 text-lg">
            당신의 주요 성과와 프로젝트를 포트폴리오에 등록해보세요.
          </p>
        </div>

        {/* 프로젝트 목록 */}
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectItemCard
              key={project.id}
              item={project}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onSave={handleSaveProject}
            />
          ))}
        </div>

        {/* 프로젝트 추가 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAddProject}
            className="flex items-center justify-center space-x-2 text-indigo-600 font-bold border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition duration-150 rounded-xl w-full p-4 text-lg shadow-inner transform hover:scale-[1.005]"
            disabled={isSaving}
          >
            <Plus size={24} />
            <span>새 프로젝트 추가</span>
          </button>
        </div>
      </div>

      {isSaving && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex items-center space-x-4 border border-indigo-200">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="text-indigo-600 font-semibold text-lg">
              데이터 저장 중...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
