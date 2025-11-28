/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Plus,
  X,
  Save,
  Calendar,
  Trash2,
  PlusCircle,
  FolderOpen,
  AlignLeft,
  LinkIcon,
} from "lucide-react";
import {
  createProject,
  deleteProject,
  getProjectList,
  updateProject,
} from "@/api/project";
import { ProjectResponse } from "@/types/project";

// ===============================================
// ✅ 프로젝트 모달 관련 타입
// ===============================================

export interface DateFields {
  year: string;
  month: string;
  day: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  startDate: DateFields;
  endDate: DateFields;
  description: string;
  link: string;
  imageFile: File | null;
  imageUrl?: string | null; // ✅ 서버 이미지 URL
  isNew: boolean;
}

// ===============================================
// ✅ 유틸
// ===============================================

// "2024-01-01" → { year: "2024", month: "01", day: "01" }
const toDateFields = (dateString: string): DateFields => {
  const [year, month, day] = dateString.split("-");
  return { year, month, day };
};

const createNewProject = (): ProjectItem => ({
  id: crypto.randomUUID(),
  title: "",
  startDate: { year: "2024", month: "01", day: "01" },
  endDate: { year: "2024", month: "12", day: "31" },
  description: "",
  link: "",
  imageFile: null,
  imageUrl: null,
  isNew: true,
});

// ===============================================
// ✅ 날짜 입력 그룹
// ===============================================

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

// ===============================================
// ✅ 프로젝트 카드
// ===============================================

const ProjectItemCard: React.FC<{
  item: ProjectItem;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onDelete: (id: string) => void;
  onSave: (item: ProjectItem) => void;
  isSaving: boolean;
}> = ({ item, onUpdate, onDelete, onSave, isSaving }) => {
  const handleDateChange =
    (type: "start" | "end") => (fields: Partial<DateFields>) => {
      const key = type === "start" ? "startDate" : "endDate";
      onUpdate(item.id, { [key]: { ...item[key], ...fields } as any });
    };

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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onUpdate(item.id, { [field]: e.target.value } as any)
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
    </div>
  );

  const imagePreviewUrl = useMemo(
    () =>
      item.imageFile
        ? URL.createObjectURL(item.imageFile)
        : item.imageUrl || null,
    [item.imageFile, item.imageUrl]
  );

  useEffect(() => {
    return () => {
      if (item.imageFile && imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl, item.imageFile]);

  return (
    <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 mb-6 border border-indigo-100">
      {/* 타이틀 및 Image 박스 */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6 items-start">
        <div className="relative w-24 h-24 bg-indigo-50 rounded-xl flex-shrink-0 flex items-center justify-center text-indigo-600 text-xs font-bold shadow-inner overflow-hidden border-2 border-dashed border-indigo-200 group">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="프로젝트 이미지 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <FolderOpen size={30} className="text-indigo-400" />
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) =>
              onUpdate(item.id, {
                imageFile: e.target.files?.[0] ?? null,
              })
            }
            aria-label="프로젝트 이미지 업로드"
          />
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

      {/* 날짜 입력 */}
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

      {/* 설명 */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
          <AlignLeft size={16} className="text-indigo-600" />
          <span className="ml-1">상세 설명</span>
        </label>
        <textarea
          value={item.description}
          onChange={(e) =>
            onUpdate(item.id, { description: e.target.value } as any)
          }
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y transition shadow-sm"
        />
      </div>

      {/* 링크 */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
          <LinkIcon size={16} className="text-indigo-600" />
          <span className="ml-1">프로젝트 링크 (선택 사항)</span>
        </label>
        <input
          type="url"
          value={item.link}
          onChange={(e) => onUpdate(item.id, { link: e.target.value } as any)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3 border-t pt-4">
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition duration-150 shadow-md transform hover:scale-[1.02]"
          disabled={isSaving}
        >
          <Trash2 size={16} />
          <span>삭제</span>
        </button>

        <button
          onClick={() => onSave(item)}
          disabled={!isFilled || isSaving}
          className={`flex items-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl transition duration-150 shadow-lg transform hover:scale-[1.02] ${
            isFilled && !isSaving
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save size={16} />
          )}
          <span>{item.isNew ? "저장하기" : "업데이트"}</span>
        </button>
      </div>
    </div>
  );
};

// ===============================================
// ✅ 모달 본문(프로젝트 폼)
// ===============================================

const ProjectFormContent: React.FC<{
  onClose: () => void;
  onProjectsSaved: (savedProjectsCount: number) => void;
  isOpen: boolean;
}> = ({ onClose, onProjectsSaved, isOpen }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isAnyProjectSaving, setIsAnyProjectSaving] = useState(false);

  // 🔥 모달 열릴 때 기존 프로젝트 불러오기
  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      try {
        const projectList: ProjectResponse[] = await getProjectList();

        const formattedProjects: ProjectItem[] = projectList.map((project) => ({
          id: project.id.toString(),
          title: project.title ?? "",
          startDate: toDateFields(project.startDate),
          endDate: toDateFields(project.endDate),
          description: project.description ?? "",
          link: project.linkUrl ?? "",
          imageFile: null,
          imageUrl: project.imageUrl ?? null,
          isNew: false,
        }));

        setProjects(formattedProjects);
        onProjectsSaved(formattedProjects.length);
      } catch (error) {
        console.error("프로젝트 목록을 가져오는 중 오류 발생:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [isOpen, onProjectsSaved]);

  const handleAddProject = useCallback(() => {
    setProjects((prev) => [...prev, createNewProject()]);
  }, []);

  const handleUpdateProject = useCallback(
    (id: string, updates: Partial<ProjectItem>) => {
      setProjects((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      const numericId = Number(id);

      try {
        // isNew → 서버에 없는 데이터는 DELETE 하지 않음
        const target = projects.find((p) => p.id === id);
        if (!target?.isNew) {
          await deleteProject(numericId);
        }
      } catch (e) {
        console.error("삭제 중 오류:", e);
      }

      // UI 즉시 업데이트
      setProjects((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        onProjectsSaved(updated.filter((p) => !p.isNew).length);
        return updated;
      });
    },
    [projects, onProjectsSaved]
  );

  //   const handleSaveProject = useCallback(
  //     async (project: ProjectItem) => {
  //       const isDateValid = (d: DateFields) =>
  //         d.year.length === 4 && d.month.length > 0 && d.day.length > 0;

  //       if (
  //         !project.title.trim() ||
  //         !project.description.trim() ||
  //         !isDateValid(project.startDate) ||
  //         !isDateValid(project.endDate)
  //       ) {
  //         console.error("필수 입력 사항 누락");
  //         return;
  //       }

  //       setIsAnyProjectSaving(true);

  //       try {
  //         const startDate = `${
  //           project.startDate.year
  //         }-${project.startDate.month.padStart(
  //           2,
  //           "0"
  //         )}-${project.startDate.day.padStart(2, "0")}`;
  //         const endDate = `${
  //           project.endDate.year
  //         }-${project.endDate.month.padStart(
  //           2,
  //           "0"
  //         )}-${project.endDate.day.padStart(2, "0")}`;

  //         const dto = {
  //           title: project.title,
  //           description: project.description,
  //           startDate,
  //           endDate,
  //           linkUrl: project.link ?? "",
  //         };

  //         const formData = new FormData();
  //         formData.append(
  //           "dto",
  //           new Blob([JSON.stringify(dto)], { type: "application/json" })
  //         );
  //         if (project.imageFile) {
  //           formData.append("image", project.imageFile);
  //         }

  //         if (project.isNew) {
  //           // 새 프로젝트 → POST
  //           await createProject(formData);
  //         } else {
  //           // 기존 프로젝트 수정 → PUT
  //           await updateProject(Number(project.id), formData);
  //         }

  //         setProjects((prev) => {
  //           const updatedProjects = prev.map((item) =>
  //             item.id === project.id ? { ...project, isNew: false } : item
  //           );
  //           onProjectsSaved(updatedProjects.filter((p) => !p.isNew).length);
  //           return updatedProjects;
  //         });
  //       } catch (e) {
  //         console.error(e);
  //       } finally {
  //         setIsAnyProjectSaving(false);
  //       }
  //     },
  //     [onProjectsSaved]
  //   );
  const handleSaveProject = useCallback(async (project: ProjectItem) => {
    setIsAnyProjectSaving(true);

    try {
      const startDate = `${
        project.startDate.year
      }-${project.startDate.month.padStart(
        2,
        "0"
      )}-${project.startDate.day.padStart(2, "0")}`;

      const endDate = `${project.endDate.year}-${project.endDate.month.padStart(
        2,
        "0"
      )}-${project.endDate.day.padStart(2, "0")}`;

      const dto = {
        title: project.title,
        description: project.description,
        startDate,
        endDate,
        linkUrl: project.link,
      };

      const formData = new FormData();
      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      if (project.imageFile) {
        formData.append("image", project.imageFile);
      }

      if (project.isNew) {
        // 🔥 새 프로젝트 → POST
        await createProject(formData);
      } else {
        // 🔥 기존 프로젝트 → PUT
        await updateProject(Number(project.id), formData);
      }

      // 저장 후 상태 업데이트
      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id ? { ...project, isNew: false } : item
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnyProjectSaving(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-slate-50 z-10">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <PlusCircle size={30} className="mr-2 text-indigo-600" />
          프로젝트 상세 등록
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          disabled={isAnyProjectSaving}
        >
          <X size={24} />
        </button>
      </div>

      {/* 리스트 */}
      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectItemCard
            key={project.id}
            item={project}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            onSave={handleSaveProject}
            isSaving={isAnyProjectSaving}
          />
        ))}
      </div>

      {/* 추가 */}
      <div className="mt-8 text-center">
        <button
          onClick={handleAddProject}
          className="flex items-center justify-center space-x-2 text-indigo-600 font-bold border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition duration-150 rounded-xl w-full p-4 text-lg shadow-inner transform hover:scale-[1.005]"
          disabled={isAnyProjectSaving}
        >
          <Plus size={24} />
          <span>새 프로젝트 추가</span>
        </button>
      </div>
    </div>
  );
};

// ===============================================
// ✅ 모달 셸(배경/레이아웃)
// ===============================================

const ModalShell: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-[#70707080] flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-y-auto transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// ===============================================
// ✅ 외부에서 쓰는 최종 ProjectModal 컴포넌트
// ===============================================

export default function ProjectModal({
  isOpen,
  onClose,
  onProjectsSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProjectsSaved: (count: number) => void;
}) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <ProjectFormContent
        onClose={onClose}
        onProjectsSaved={onProjectsSaved}
        isOpen={isOpen}
      />
    </ModalShell>
  );
}
