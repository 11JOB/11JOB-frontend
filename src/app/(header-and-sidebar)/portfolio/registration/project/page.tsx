"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Save } from "lucide-react";

// --- Firebase Imports Placeholder (실제 앱 ID와 토큰 사용) ---
// 이 변수들은 런타임 환경에서 제공됩니다.
// const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
// const firebaseConfig =
//   typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};

/* // NOTE: Firebase를 실제로 사용하려면 아래 주석을 해제하고,
// 프로젝트 상태 관리 및 Firestore 연동 로직을 추가해야 합니다.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
*/

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
  startDate: { year: "YYYY", month: "MM", day: "DD" },
  endDate: { year: "YYYY", month: "MM", day: "DD" },
  description: "",
  link: "",
  isNew: true,
});

// --- 2. 서브 컴포넌트: 날짜 입력 그룹 ---

const DateInputGroup: React.FC<{
  date: DateFields;
  onChange: (fields: Partial<DateFields>) => void;
  label: string;
}> = ({ date, onChange, label }) => (
  <div className="flex items-center space-x-1">
    <span className="text-sm font-medium text-gray-700 w-12 text-right">
      {label}:
    </span>
    <input
      type="text"
      placeholder="YYYY"
      value={date.year === "YYYY" ? "" : date.year}
      onChange={(e) => onChange({ year: e.target.value.slice(0, 4) })}
      className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 text-sm"
      maxLength={4}
    />
    <span className="text-gray-500">-</span>
    <input
      type="text"
      placeholder="MM"
      value={date.month === "MM" ? "" : date.month}
      onChange={(e) => onChange({ month: e.target.value.slice(0, 2) })}
      className="w-12 p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 text-sm"
      maxLength={2}
    />
    <span className="text-gray-500">-</span>
    <input
      type="text"
      placeholder="DD"
      value={date.day === "DD" ? "" : date.day}
      onChange={(e) => onChange({ day: e.target.value.slice(0, 2) })}
      className="w-12 p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 text-sm"
      maxLength={2}
    />
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

  const isFilled =
    item.title &&
    item.description &&
    item.startDate.year.length === 4 &&
    item.endDate.year.length === 4;

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      {/* 타이틀 및 날짜 */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-4 items-start">
        {/* 이미지 Placeholder (스크린샷에 있는 작은 네모) */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
          Image
        </div>

        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            프로젝트 제목
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={item.title}
            onChange={(e) => onUpdate(item.id, { title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 날짜 입력 (Start ~ End) */}
      <div className="flex flex-col space-y-3 mb-4 p-3 border-y border-gray-100">
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
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          상세 설명
        </label>
        <textarea
          placeholder="진행한 프로젝트에 대한 상세 내용을 입력하세요."
          value={item.description}
          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y"
        />
      </div>

      {/* 링크 (Link) */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          링크
        </label>
        <input
          type="url"
          placeholder="프로젝트 링크 (GitHub, Demo URL 등)"
          value={item.link}
          onChange={(e) => onUpdate(item.id, { link: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-3">
        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 shadow-md"
        >
          <Trash2 size={16} />
          <span>삭제</span>
        </button>

        {/* 저장/업데이트 버튼 */}
        <button
          onClick={() => onSave(item)}
          disabled={!isFilled}
          className={`flex items-center space-x-1 px-4 py-2 text-sm font-bold rounded-lg transition duration-150 shadow-md ${
            isFilled
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Save size={16} />
          <span>{item.isNew ? "저장" : "업데이트"}</span>
        </button>
      </div>
    </div>
  );
};

// --- 4. 메인 컴포넌트 ---

export default function ProjectRegisterPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([createNewProject()]);
  const [isSaving, setIsSaving] = useState(false);

  /* // NOTE: 실제 Firebase 인증 및 데이터 로딩 로직을 여기에 구현해야 합니다.
  useEffect(() => {
    // 1. 사용자 인증 (__initial_auth_token 사용)
    const authenticate = async () => {
      try {
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        const userId = auth.currentUser?.uid || 'anonymous';
        // 2. 데이터 불러오기 (onSnapshot)
        // ... (Firestore 쿼리 및 onSnapshot 로직 추가)
      } catch (error) {
        console.error("Firebase authentication error:", error);
      }
    };
    authenticate();
  }, []);
  */

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
    // NOTE: 실제 앱에서는 deleteDoc(doc(db, ...)) 호출 필요
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
      // await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/projects`, project.id), { ...project, timestamp: serverTimestamp() });
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          프로젝트 등록
        </h1>
        <p className="text-gray-500 mb-8">
          진행했던 프로젝트를 등록하고 관리해 보세요.
        </p>

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
            className="flex items-center justify-center space-x-2 text-indigo-600 font-bold border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition duration-150 rounded-lg w-full p-4"
            disabled={isSaving}
          >
            <Plus size={20} />
            <span>추가</span>
          </button>
        </div>
      </div>

      {isSaving && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <p className="text-indigo-600">저장 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
