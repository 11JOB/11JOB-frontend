export default function Header() {
  return (
    <div className="w-full h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-[16px]">
      <p className="text-black text-2xl leading-relaxed tracking-tighter">
        11JOB
        <span className="text-[#303030] text-sm leading-relaxed tracking-tight">
          상세한 취업일정 관리를 통해 취뽀하자!
        </span>
      </p>
      <p className="flex flex-row align-center justify-center p-auto text-[#303030] text-sm leading-relaxed tracking-tight">
        111@111.111
        <button className="rounded-[4px] border border-[var(--active-active-line-act_l_03_lightg,#BBBBC0)] bg-[var(--active-active-background-act_bg_07_white,#FFF)] shadow-[0_1px_2px_0_rgba(17,17,17,0.12)] flex px-[6px] py-[3.5px] justify-center items-center gap-[2px]">
          로그아웃
        </button>
      </p>
    </div>
  );
}
