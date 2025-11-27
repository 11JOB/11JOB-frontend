/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  X,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Zap,
  BookOpen,
  Award,
  LinkIcon,
} from "lucide-react";

import { createPortfolio, getPortfolio } from "@/api/portfolio";
import type {
  CreatePortfolioRequest,
  PortfolioResponse,
} from "@/types/portfolio";
import ProjectModal from "./projectModal"; // ✅ 모달 컴포넌트 임포트

// --- 1. 타입 정의 ---

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string | null; // Base64(미리보기용)
}

interface BaseDetailItem {
  id: number;
  institution?: string;
  title?: string;
  detail?: string;
}

interface EducationCareerActivity extends BaseDetailItem {
  institution: string;
  entryDate: string; // YYYY-MM
  exitDate: string | "재직 중"; // YYYY-MM
  title?: never;
}

interface Introduction extends BaseDetailItem {
  title: string;
  link: string;
  institution?: never;
}

interface Certification extends BaseDetailItem {
  title: string;
  acquisitionDate: string; // YYYY-MM-DD
  institution?: never;
  link?: never;
}

type DetailItem = EducationCareerActivity | Introduction | Certification;
type DetailList = DetailItem[];
type DetailType = "edu" | "career" | "activity" | "intro" | "cert";

interface FormSectionProps {
  title: string;
  list: DetailList;
  handlers: {
    onAdd: () => void;
    onRemove: (id: number) => void;
    onChange: (id: number, field: string, value: string) => void;
  };
  type: DetailType;
  icon: React.ReactNode;
}

// --- 2. 유틸리티 함수 및 타입 가드 ---

const createNewDetail = (id: number, type: DetailType): DetailItem => {
  if (type === "edu" || type === "career" || type === "activity") {
    return {
      id,
      institution: "",
      entryDate: "2024-01",
      exitDate: "2024-12",
    } as EducationCareerActivity;
  }
  if (type === "intro") {
    return { id, title: "", link: "" } as Introduction;
  }
  if (type === "cert") {
    return { id, title: "", acquisitionDate: "2024-01-01" } as Certification;
  }
  throw new Error(`Invalid DetailType: ${type}`);
};

const isEducationCareerActivity = (
  item: DetailItem
): item is EducationCareerActivity => {
  return (item as EducationCareerActivity).entryDate !== undefined;
};

const isIntroduction = (item: DetailItem): item is Introduction => {
  return (item as Introduction).link !== undefined;
};

const isCertification = (item: DetailItem): item is Certification => {
  return (item as Certification).acquisitionDate !== undefined;
};

// --- 3. 서브 컴포넌트 ---

const DateInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 sr-only">
      연월
    </label>
    <input
      id={id}
      type="month"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full transition"
    />
  </div>
);

const DynamicFormItem: React.FC<{
  item: DetailItem;
  type: DetailType;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
}> = ({ item, type, onChange, onRemove }) => {
  const handleChange = (field: string, value: string) => {
    onChange(item.id, field, value);
  };

  const isDateRangeType = isEducationCareerActivity(item);
  const isCertType = isCertification(item);
  const isIntroType = isIntroduction(item);

  return (
    <div className="p-5 border border-gray-200 rounded-xl mb-4 bg-white transition duration-200 shadow-md hover:shadow-xl hover:border-indigo-300 relative group">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-3 right-3 p-1 text-gray-400 bg-gray-50 rounded-full hover:text-red-600 hover:bg-red-100 transition duration-150 opacity-0 group-hover:opacity-100"
        aria-label="항목 삭제"
      >
        <X size={18} />
      </button>

      <div className="mb-3 mt-1">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {isIntroType || isCertType ? "제목" : "기관명/회사명"}
        </label>
        <input
          type="text"
          value={item.institution || item.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const field = isIntroType || isCertType ? "title" : "institution";
            handleChange(field, e.target.value);
          }}
          placeholder={
            isIntroType || isCertType ? "표시할 제목 입력" : "기관명 입력"
          }
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          상세 내용 (선택 사항)
        </label>
        <textarea
          value={item.detail || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("detail", e.target.value)
          }
          placeholder="상세 내용이나 설명을 입력하세요."
          rows={2}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
        />
      </div>

      <div
        className={`grid ${
          isDateRangeType ? "grid-cols-2 gap-3" : "grid-cols-1"
        } mt-3`}
      >
        {isDateRangeType && (
          <>
            <div className="col-span-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                시작 연월
              </label>
              <DateInput
                id={`${type}-${item.id}-start`}
                label="시작 연월"
                value={item.entryDate}
                onChange={(value) => handleChange("entryDate", value)}
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                종료 연월
              </label>
              <DateInput
                id={`${type}-${item.id}-end`}
                label="종료 연월"
                value={item.exitDate}
                onChange={(value) => handleChange("exitDate", value)}
              />
            </div>
          </>
        )}

        {isCertType && (
          <div className="col-span-1">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              취득 연월일
            </label>
            <input
              type="date"
              value={item.acquisitionDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("acquisitionDate", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        )}
      </div>

      {isIntroType && (
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
            <LinkIcon size={14} className="text-indigo-500 mr-1" />
            연결 링크
          </label>
          <input
            type="url"
            value={item.link}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("link", e.target.value)
            }
            placeholder="연결 링크 입력 (GitHub, 노션, 블로그 등)"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      )}
    </div>
  );
};

const FormSection: React.FC<FormSectionProps> = ({
  title,
  list,
  handlers,
  type,
  icon,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100">
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <button
        type="button"
        onClick={handlers.onAdd}
        className="flex items-center text-sm font-semibold text-indigo-600 px-3 py-1 border border-indigo-200 rounded-full bg-indigo-50 hover:bg-indigo-100 transition duration-150 shadow-sm"
      >
        <Plus size={16} className="mr-1" />
        항목 추가
      </button>
    </div>

    {list.map((item) => (
      <DynamicFormItem
        key={item.id}
        item={item}
        type={type}
        onChange={handlers.onChange}
        onRemove={handlers.onRemove}
      />
    ))}

    {list.length === 0 && (
      <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        등록된 항목이 없습니다. &apos;항목 추가&lsquo; 버튼을 눌러주세요.
      </div>
    )}
  </div>
);

// --- 4. 메인 컴포넌트 ---
export default function PortfolioRegistration() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // ✅ 모달 상태 추가
  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: null,
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [educationList, setEducationList] = useState<DetailList>([]);
  const [careerList, setCareerList] = useState<DetailList>([]);
  const [activityList, setActivityList] = useState<DetailList>([]);
  const [introList, setIntroList] = useState<DetailList>([]);
  const [certList, setCertList] = useState<DetailList>([]);

  // ✅ 포트폴리오 데이터 가져오기
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data: PortfolioResponse = await getPortfolio();

        setProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.phone,
          address: data.address,
          profileImage: data.profileImageUrl,
        });

        setEducationList(
          data.educations.map((edu, index) => ({
            id: index + 1,
            institution: edu.institutionName || "",
            entryDate: edu.startDate || "",
            exitDate: edu.endDate || "",
          }))
        );

        setCareerList(
          data.experiences.map((exp, index) => ({
            id: index + 1,
            institution: exp.institutionName || "",
            entryDate: exp.startDate || "",
            exitDate: exp.endDate || "",
          }))
        );

        setActivityList(
          data.activities.map((act, index) => ({
            id: index + 1,
            institution: act.institutionName || "",
            entryDate: act.startDate || "",
            exitDate: act.endDate || "",
          }))
        );

        setIntroList(
          data.links.map((link, index) => ({
            id: index + 1,
            title: link.title || "",
            link: link.url || "",
          }))
        );

        setCertList(
          data.certificates.map((cert, index) => ({
            id: index + 1,
            title: cert.title || "",
            acquisitionDate: cert.acquireDate || "",
          }))
        );
      } catch (err) {
        console.error("❌ 포트폴리오 불러오기 실패:", err);

        // 기본값 설정
        setEducationList([createNewDetail(1, "edu")]);
        setCareerList([createNewDetail(1, "career")]);
        setActivityList([createNewDetail(1, "activity")]);
        setIntroList([createNewDetail(1, "intro")]);
        setCertList([createNewDetail(1, "cert")]);
      }
    };

    fetchPortfolio();
  }, []);

  const handleOpenProjectModal = () => setIsProjectModalOpen(true); // ✅ 모달 열기
  const handleCloseProjectModal = () => setIsProjectModalOpen(false); // ✅ 모달 닫기

  const getNextId = (list: DetailList): number =>
    list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1;

  const handleProfileChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const createListHandlers = (
    list: DetailList,
    setList: React.Dispatch<React.SetStateAction<DetailList>>,
    type: DetailType
  ) => ({
    onAdd: () => {
      const newId = getNextId(list);
      setList((prev) => [...prev, createNewDetail(newId, type)]);
    },
    onRemove: (id: number) => {
      setList((prev) => prev.filter((item) => item.id !== id));
    },
    onChange: (id: number, field: string, value: string) => {
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? ({ ...item, [field]: value } as DetailItem) : item
        )
      );
    },
  });

  const eduHandlers = useMemo(
    () => createListHandlers(educationList, setEducationList, "edu"),
    [educationList]
  );
  const careerHandlers = useMemo(
    () => createListHandlers(careerList, setCareerList, "career"),
    [careerList]
  );
  const activityHandlers = useMemo(
    () => createListHandlers(activityList, setActivityList, "activity"),
    [activityList]
  );
  const introHandlers = useMemo(
    () => createListHandlers(introList, setIntroList, "intro"),
    [introList]
  );
  const certHandlers = useMemo(
    () => createListHandlers(certList, setCertList, "cert"),
    [certList]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    handleProfileChange("profileImage", previewUrl);

    // URL 객체 해제 방지
    return () => URL.revokeObjectURL(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: CreatePortfolioRequest = {
      phone: profile.phone,
      address: profile.address,

      // ✅ educations = 학력
      educations: educationList.filter(isEducationCareerActivity).map((i) => ({
        institutionName: i.institution,
        startDate: i.entryDate,
        endDate: i.exitDate,
      })),

      // ✅ experiences = 경력
      experiences: careerList.filter(isEducationCareerActivity).map((i) => ({
        institutionName: i.institution,
        startDate: i.entryDate,
        endDate: i.exitDate,
      })),

      // ✅ activities = 대외활동
      activities: activityList.filter(isEducationCareerActivity).map((i) => ({
        institutionName: i.institution,
        startDate: i.entryDate,
        endDate: i.exitDate,
      })),

      // ✅ links = 링크
      links: introList.filter(isIntroduction).map((i) => ({
        title: i.title,
        url: i.link,
      })),

      // ✅ certificates = 자격증
      certificates: certList.filter(isCertification).map((i) => ({
        title: i.title,
        acquireDate: i.acquisitionDate,
      })),
    };

    try {
      const saved = await createPortfolio(dto, profileImageFile);
      console.log("✅ 포트폴리오 저장 성공:", saved);
    } catch (err) {
      console.error("❌ 포트폴리오 저장 실패:", err);
    }
  };

  const InputIcon: React.FC<{
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
  }> = ({ icon, placeholder, value, onChange, type = "text" }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-600">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
            포트폴리오 빌더
          </h1>
          <p className="text-gray-500 text-lg">
            기본 정보부터 경력까지, 당신의 포트폴리오를 구성해 보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. 개인 정보 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center text-indigo-600">
              <User size={24} className="mr-2" />
              개인 기본 정보
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 이미지 영역 */}
              <div className="flex flex-col items-center justify-center col-span-1 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 transition cursor-pointer relative group aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="프로필 이미지 업로드"
                />
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500 p-4">
                    <Camera
                      size={40}
                      className="mb-2 text-indigo-400 group-hover:text-indigo-600 transition"
                    />
                    <span className="text-sm font-semibold">
                      프로필 사진 등록
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      클릭하여 이미지 업로드
                    </span>
                  </div>
                )}
              </div>

              {/* 입력 필드 영역 */}
              <div className="col-span-2 space-y-4">
                <InputIcon
                  icon={<User size={18} className="text-gray-400" />}
                  placeholder="이름"
                  value={profile.name}
                  onChange={(value) => handleProfileChange("name", value)}
                />
                <InputIcon
                  icon={<Mail size={18} className="text-gray-400" />}
                  placeholder="이메일"
                  value={profile.email}
                  onChange={(value) => handleProfileChange("email", value)}
                  type="email"
                />
                <InputIcon
                  icon={<Phone size={18} className="text-gray-400" />}
                  placeholder="연락처 (예: 010-1234-1234)"
                  value={profile.phone}
                  onChange={(value) => handleProfileChange("phone", value)}
                  type="tel"
                />
                <InputIcon
                  icon={<MapPin size={18} className="text-gray-400" />}
                  placeholder="주소 입력"
                  value={profile.address}
                  onChange={(value) => handleProfileChange("address", value)}
                />
              </div>
            </div>
          </div>

          {/* 2. educations = 학력 */}
          <FormSection
            title="학력 및 교육 이력"
            list={educationList}
            handlers={eduHandlers}
            type="edu"
            icon={<GraduationCap size={20} className="text-indigo-500" />}
          />

          {/* 3. experiences = 경력 */}
          <FormSection
            title="경력 (재직/인턴)"
            list={careerList}
            handlers={careerHandlers}
            type="career"
            icon={<Briefcase size={20} className="text-indigo-500" />}
          />

          {/* 4. activities = 대외 활동 */}
          <FormSection
            title="대외 활동 및 프로젝트"
            list={activityList}
            handlers={activityHandlers}
            type="activity"
            icon={<Zap size={20} className="text-indigo-500" />}
          />

          {/* 5. links = 링크 */}
          <FormSection
            title="자기소개서/포스팅 (링크 첨부)"
            list={introList}
            handlers={introHandlers}
            type="intro"
            icon={<BookOpen size={20} className="text-indigo-500" />}
          />

          {/* 6. certificates = 자격증 */}
          <FormSection
            title="자격증 및 기술 스택"
            list={certList}
            handlers={certHandlers}
            type="cert"
            icon={<Award size={20} className="text-indigo-500" />}
          />

          {/* ✅ 버튼 2개를 위아래로 배치 (스타일 크게 안 바꿈) */}
          <div className="flex flex-col items-center pt-8 gap-4">
            {/* 포트폴리오 저장 */}
            <button
              type="submit"
              className="px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02] active:scale-100 active:bg-indigo-800 w-full"
            >
              포트폴리오 최종 저장
            </button>

            {/* 프로젝트 등록 모달 열기 */}
            <button
              type="button"
              onClick={handleOpenProjectModal} // ✅ 모달 열기
              className="px-10 py-4 bg-white text-indigo-600 text-lg font-bold rounded-xl shadow-xl border border-indigo-200 hover:bg-indigo-50 transition duration-150 transform hover:scale-[1.02] w-full"
            >
              프로젝트 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* ✅ 모달 컴포넌트 추가 */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        onProjectsSaved={(count) =>
          console.log(`${count}개의 프로젝트가 저장되었습니다.`)
        }
      />
    </div>
  );
}
