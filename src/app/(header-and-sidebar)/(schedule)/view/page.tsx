import { Suspense } from "react";
import ScheduleViewClient from "./view-client";

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">로딩 중...</div>}>
      <ScheduleViewClient />
    </Suspense>
  );
}
