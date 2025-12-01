// app/portfolio/_components/EmptyPortfolioState.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";

const EmptyPortfolioState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-indigo-200 shadow-sm max-w-md w-full">
      <p className="text-2xl font-bold text-slate-900 mb-3 text-center">
        포트폴리오를 작성해보세요!
      </p>
      <p className="text-sm text-slate-500 mb-8 text-center">
        아직 등록된 포트폴리오가 없어요. <br />
        나만의 포트폴리오를 만들어 실력을 보여주세요.
      </p>

      <Link
        href="/portfolio/registration"
        className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full
                   bg-indigo-600 text-white text-sm sm:text-base font-semibold
                   shadow-[0_10px_25px_rgba(79,70,229,0.35)]
                   hover:bg-indigo-700 hover:shadow-[0_14px_30px_rgba(79,70,229,0.45)]
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                   transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md
                   transition-all duration-150"
      >
        <Plus className="w-4 h-4 mr-2" />
        포트폴리오 작성하러 가기
      </Link>
    </div>
  );
};

export default EmptyPortfolioState;
