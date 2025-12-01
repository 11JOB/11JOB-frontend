"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import {
  Calendar,
  Zap,
  FileText,
  ChevronLeft,
  Building2,
  Link as LinkIcon,
  Download,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getScheduleList,
  deleteSchedule,
  updateSchedule,
} from "@/api/schedule";
import type {
  Schedule,
  ScheduleFile,
  UpdateScheduleRequest,
} from "@/types/schedule";
import CompleteModal from "@/components/complete-modal"; // ✅ 추가
import ConfirmModal from "@/components/confirm-modal"; // ✅ 추가

// 오늘 기준 날짜 유틸
const today = new Date();
const toDate = (dateStr: string) => new Date(`${dateStr}T00:00:00`);

// -----------------------------------------------------------------------------
// 일정 카드
// -----------------------------------------------------------------------------

const ScheduleCard: React.FC<{
  schedule: Schedule;
  onSelect: (id: number) => void;
}> = ({ schedule, onSelect }) => {
  const scheduleDateTime = toDate(schedule.scheduleDate);
  const isPast = scheduleDateTime < today;

  const cardStyle = isPast
    ? "bg-gray-50 border-gray-200 text-gray-500 opacity-80 cursor-pointer"
    : "bg-white border-blue-100 shadow-sm hover:shadow-lg transition duration-200 cursor-pointer";

  const formattedDate = scheduleDateTime.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });

  const weekday = scheduleDateTime.toLocaleDateString("ko-KR", {
    weekday: "short",
  });

  return (
    <div
      className={`flex space-x-4 p-4 border rounded-xl ${cardStyle}`}
      onClick={() => onSelect(schedule.scheduleId)}
      role="button"
    >
      {/* 날짜/요일 */}
      <div
        className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 flex-shrink-0 ${
          isPast
            ? "bg-gray-200 text-gray-600"
            : "bg-blue-500 text-white shadow-md"
        }`}
      >
        <span className="text-lg font-bold leading-none">
          {formattedDate.replace(".", "/").replace(".", "")}
        </span>
        <span className="text-xs font-medium mt-0.5">{weekday}</span>
      </div>

      {/* 내용 */}
      <div className="flex flex-col space-y-1 w-full min-w-0">
        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border truncate ${
              isPast
                ? "bg-gray-200 text-gray-600 border-gray-300"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {schedule.companyName}
          </span>
          <h2
            className={`text-lg font-bold text-gray-900 truncate ${
              isPast ? "line-through text-gray-400" : ""
            }`}
          >
            {schedule.title}
          </h2>
        </div>

        {/* 세부 정보 요약 */}
        <div className="flex items-start space-x-4 text-sm text-gray-600 mt-1">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-gray-400" />
            <span>세부 {schedule.details.length}개</span>
          </div>
          {schedule.files && schedule.files.length > 0 && (
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>파일 {schedule.files.length}개</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 일정 목록 뷰
// -----------------------------------------------------------------------------

const ScheduleListView: React.FC<{
  schedules: Schedule[];
  onSelectSchedule: (id: number) => void;
}> = ({ schedules, onSelectSchedule }) => {
  const sortedSchedules = useMemo(() => {
    const now = new Date();

    return [...schedules].sort((a, b) => {
      const dateA = toDate(a.scheduleDate);
      const dateB = toDate(b.scheduleDate);

      const isPastA = dateA < now;
      const isPastB = dateB < now;

      // 과거 일정은 뒤로
      if (isPastA !== isPastB) {
        return isPastA ? 1 : -1;
      }
      // 같은 그룹 안에서는 날짜 오름차순
      return dateA.getTime() - dateB.getTime();
    });
  }, [schedules]);

  const groupedSchedules = useMemo(() => {
    return sortedSchedules.reduce((acc, schedule) => {
      const dateKey = schedule.scheduleDate;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);
  }, [sortedSchedules]);

  const DateGroup: React.FC<{
    date: string;
    items: Schedule[];
  }> = ({ date, items }) => {
    const dateObj = toDate(date);
    const isToday = today.toDateString() === dateObj.toDateString();

    const formattedDate = dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

    return (
      <div className="border-l-4 border-blue-400 pl-4 space-y-4">
        <h2
          className={`text-xl font-bold ${
            isToday ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {formattedDate}{" "}
          {isToday && (
            <span className="text-sm font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">
              오늘
            </span>
          )}
        </h2>
        <div className="space-y-3">
          {items.map((schedule) => (
            <ScheduleCard
              key={schedule.scheduleId}
              schedule={schedule}
              onSelect={onSelectSchedule}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedSchedules).map(([date, items]) => (
        <DateGroup key={date} date={date} items={items} />
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 상세 + 인라인 수정 + 파일 추가/삭제
// -----------------------------------------------------------------------------

type UpdatePayload = {
  draft: Schedule;
  filesToUpload: File[];
  filesToDelete: number[];
};

const ScheduleDetailView: React.FC<{
  schedule: Schedule;
  onBack: () => void;
  onUpdate: (payload: UpdatePayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}> = ({ schedule, onBack, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Schedule>(schedule);
  const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null); // ✅ 완료 모달 메시지 상태
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // ✅ 확인 모달 상태

  useEffect(() => {
    setDraft(schedule);
    setIsEditing(false);
    setFilesToDelete([]);
    setNewFiles([]);
  }, [schedule]);

  const scheduleDateObj = toDate(draft.scheduleDate);
  const isPast = scheduleDateObj < today;

  const formattedDate = scheduleDateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleDeleteFile = (fileId: number) => {
    setFilesToDelete((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleNewFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...filesArray]);
    e.target.value = "";
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await onDelete(schedule.scheduleId);
      setModalMessage("일정이 성공적으로 삭제되었습니다."); // ✅ 삭제 성공 메시지
    } catch (err) {
      console.error("❌ 일정 삭제 실패:", err);
      setModalMessage("일정 삭제 중 오류가 발생했습니다."); // ✅ 삭제 실패 메시지
    } finally {
      setDeleting(false);
      setIsConfirmModalOpen(false); // ✅ 확인 모달 닫기
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        draft,
        filesToUpload: newFiles,
        filesToDelete,
      });
      setModalMessage("일정이 수정되었습니다."); // ✅ 수정 성공 메시지
      setIsEditing(false);
      setFilesToDelete([]);
      setNewFiles([]);
    } catch (err) {
      console.error("❌ 일정 수정 실패:", err);
      setModalMessage("일정 수정 중 오류가 발생했습니다."); // ✅ 수정 실패 메시지
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 네비 + 액션 버튼들 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 font-medium p-2 -ml-2 rounded-lg hover:bg-blue-50"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          목록으로 돌아가기
        </button>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setDraft(schedule);
                  setIsEditing(false);
                  setFilesToDelete([]);
                  setNewFiles([]);
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50"
                disabled={saving}
              >
                수정 취소
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-500 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60"
                disabled={saving}
              >
                <Pencil className="w-4 h-4 mr-1" />
                {saving ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4 mr-1" />
                수정하기
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(true)} // ✅ 확인 모달 열기
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? "삭제 중..." : "일정 삭제"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 메인 정보 헤더 */}
      <header className="border-b pb-4 space-y-2">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-gray-500 flex-shrink-0" />
          {isEditing ? (
            <input
              className="border rounded-md px-2 py-1 text-sm w-full max-w-xs"
              value={draft.companyName}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, companyName: e.target.value }))
              }
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-700">
              {schedule.companyName}
            </h2>
          )}
        </div>

        {isEditing ? (
          <input
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 border rounded-[10px] border-gray-400 mt-2 px-1 py-2 w-full"
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        ) : (
          <h1 className="text-4xl font-extrabold text-gray-900">
            {schedule.title}
          </h1>
        )}
      </header>

      {/* 일정 날짜 및 상태 */}
      <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
        <Calendar className="w-6 h-6 text-blue-600" />
        {isEditing ? (
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm"
            value={draft.scheduleDate}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, scheduleDate: e.target.value }))
            }
          />
        ) : (
          <div className="text-lg font-bold text-blue-800">{formattedDate}</div>
        )}
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ml-auto ${
            isPast ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {isPast ? "종료된 일정" : "예정된 일정"}
        </span>
      </div>

      {/* 세부 항목 */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          세부 준비 사항
        </h3>
        <div className="space-y-4">
          {draft.details.map((detail, idx) => (
            <div
              key={detail.detailId}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2"
            >
              {isEditing ? (
                <>
                  <input
                    className="text-sm font-semibold text-gray-700 border rounded-md px-2 py-1 w-full"
                    value={detail.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        details: prev.details.map((d, i) =>
                          i === idx ? { ...d, title: value } : d
                        ),
                      }));
                    }}
                  />
                  <textarea
                    className="text-base text-gray-600 whitespace-pre-wrap border rounded-md px-2 py-1 w-full min-h-[80px]"
                    value={detail.content}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        details: prev.details.map((d, i) =>
                          i === idx ? { ...d, content: value } : d
                        ),
                      }));
                    }}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {detail.title}
                  </p>
                  <p className="text-base text-gray-600 whitespace-pre-wrap">
                    {detail.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 첨부 파일 */}
      <section className="space-y-4 pt-4 border-t">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-600" />
          첨부 파일
        </h3>

        {/* 기존 파일 */}
        <ul className="space-y-2">
          {schedule.files.length === 0 && (
            <li className="text-sm text-gray-400">등록된 파일이 없습니다.</li>
          )}

          {schedule.files.map((file: ScheduleFile) => {
            const markedForDelete = filesToDelete.includes(file.fileId);
            return (
              <li
                key={file.fileId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  markedForDelete
                    ? "bg-red-50 border-red-200"
                    : "bg-purple-50 border-purple-200"
                }`}
              >
                <span className="text-sm font-medium flex items-center">
                  <LinkIcon
                    className={`w-4 h-4 mr-2 ${
                      markedForDelete ? "text-red-500" : "text-purple-600"
                    }`}
                  />
                  <span
                    className={
                      markedForDelete
                        ? "line-through text-red-600"
                        : "text-purple-800"
                    }
                  >
                    {file.originalName}
                  </span>
                </span>

                <div className="flex items-center space-x-2">
                  {!markedForDelete && (
                    <button
                      type="button"
                      className="flex items-center text-purple-600 hover:text-purple-800 text-xs font-bold"
                      onClick={() => {
                        // 실제 파일 다운로드 URL에 맞게 변경
                        window.open(file.filePath, "_blank");
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      열기
                    </button>
                  )}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => toggleDeleteFile(file.fileId)}
                      className={`flex items-center text-xs font-bold ${
                        markedForDelete
                          ? "text-gray-600 hover:text-gray-800"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <X className="w-3 h-3 mr-1" />
                      {markedForDelete ? "삭제 취소" : "삭제"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* 새로 추가할 파일 */}
        {isEditing && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleNewFilesChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-purple-400 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-3 h-3 mr-1" />
                파일 추가
              </button>
              {newFiles.length > 0 && (
                <span className="text-xs text-gray-500">
                  새로 추가된 파일 {newFiles.length}개
                </span>
              )}
            </div>

            {newFiles.length > 0 && (
              <ul className="space-y-1 pl-1">
                {newFiles.map((file, idx) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between text-xs bg-white border border-purple-100 rounded-md px-2 py-1"
                  >
                    <span className="truncate mr-2">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* 메타 데이터 */}
      <footer className="pt-4 border-t text-sm text-gray-500 space-y-1">
        <p>생성일: {formatDateTime(schedule.createdDate)}</p>
        <p>최종 업데이트일: {formatDateTime(schedule.updatedDate)}</p>
        <p>
          스케줄 ID: {schedule.scheduleId} | 회사 ID: {schedule.companyId}
        </p>
      </footer>

      {/* ✅ 확인 모달 */}
      {isConfirmModalOpen && (
        <ConfirmModal
          message={`정말로 이 일정을 삭제하시겠습니까?\n\n[${schedule.companyName}] ${schedule.title}`}
          onConfirm={handleDeleteConfirm} // ✅ 삭제 확인
          onCancel={() => setIsConfirmModalOpen(false)} // ✅ 확인 모달 닫기
        />
      )}

      {/* ✅ 완료 모달 */}
      {modalMessage && (
        <CompleteModal
          message={modalMessage}
          onClose={() => setModalMessage(null)} // ✅ 완료 모달 닫기
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 메인 페이지 컴포넌트 (/schedule/list)
// -----------------------------------------------------------------------------

export default function JobSchedulerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect to /auth if no token
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("accessToken")) {
      window.location.href = "/auth";
    }
  }, []);

  const scheduleIdParam = searchParams.get("scheduleId");
  const selectedScheduleId =
    scheduleIdParam !== null ? Number(scheduleIdParam) : null;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 목록 조회
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getScheduleList({
          page: 0,
          size: 100,
        });

        setSchedules(data);
      } catch (err) {
        console.error("❌ 일정 목록 조회 실패:", err);
        setError("일정 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const selectedSchedule = useMemo(() => {
    if (!Array.isArray(schedules)) return undefined;
    if (selectedScheduleId == null || Number.isNaN(selectedScheduleId))
      return undefined;
    return schedules.find((s) => s.scheduleId === selectedScheduleId);
  }, [selectedScheduleId, schedules]);

  // 목록으로 돌아가기 → 쿼리 제거
  const handleBack = () => {
    router.push("/view");
  };

  // 카드 클릭 → 쿼리 붙여서 상세로
  const handleSelectSchedule = (id: number) => {
    router.push(`/view?scheduleId=${id}`);
  };

  // 수정 요청
  const handleUpdateSchedule = async ({
    draft,
    filesToUpload,
    filesToDelete,
  }: UpdatePayload) => {
    try {
      const dto: UpdateScheduleRequest = {
        companyName: draft.companyName,
        title: draft.title,
        scheduleDate: draft.scheduleDate,
        details: draft.details.map((d) => ({
          detailId: d.detailId,
          detailTitle: d.title,
          detailContent: d.content,
        })),
        filesToDelete,
      };

      // ⚠️ updateSchedule 함수는 FormData + filesToUpload 지원하도록 API 쪽에서 구현되어 있어야 함
      await updateSchedule(draft.scheduleId, dto, filesToUpload);

      const refreshed = await getScheduleList({ page: 0, size: 100 });
      setSchedules(refreshed);
    } catch (err) {
      console.error("❌ 일정 수정 실패:", err);
    }
  };

  // 삭제 요청
  const handleDeleteSchedule = async (id: number) => {
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
      router.push("/view");
    } catch (err) {
      console.error("❌ 일정 삭제 실패:", err);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 min-h-screen">
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl h-full max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <header className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Calendar className="w-7 h-7 mr-3 text-blue-500" />
            채용 일정 관리
          </h1>
          <p className="text-base text-gray-500 mt-1">
            {selectedSchedule
              ? "선택된 일정의 상세 정보를 확인하고 수정합니다."
              : "등록된 일정을 시간 순서로 확인합니다."}
          </p>
        </header>

        {/* 본문 */}
        {loading && <p className="text-gray-500">일정 목록을 불러오는 중...</p>}

        {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && !selectedSchedule && schedules.length === 0 && (
          <p className="text-gray-400 text-sm">등록된 일정이 없습니다.</p>
        )}

        {!loading && !error && !selectedSchedule && schedules.length > 0 && (
          <ScheduleListView
            schedules={schedules}
            onSelectSchedule={handleSelectSchedule}
          />
        )}

        {!loading && !error && selectedSchedule && (
          <ScheduleDetailView
            schedule={selectedSchedule}
            onBack={handleBack}
            onUpdate={handleUpdateSchedule}
            onDelete={handleDeleteSchedule}
          />
        )}
      </div>
    </div>
  );
}
