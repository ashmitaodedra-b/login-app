export function BrandPanel() {
  return (
    <aside className="hidden lg:flex relative w-[860px] flex-shrink-0 flex-col justify-center overflow-hidden bg-gradient-to-b from-[#0575e6] via-[#02298a] to-[#021b79]">
      {/* Decorative circle outlines — bottom left */}
      <div className="pointer-events-none absolute -bottom-16 -left-52 w-[638px] h-[583px]">
        <svg
          viewBox="0 0 638 583"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-30"
        >
          <circle cx="207" cy="431" r="280" stroke="white" strokeWidth="1.5" />
          <circle cx="207" cy="431" r="380" stroke="white" strokeWidth="1.5" />
          <circle cx="207" cy="431" r="180" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 px-20 mt-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-[40px] text-white leading-tight tracking-tight">
            GoFinance
          </h1>
          <p className="font-medium text-[18px] text-white leading-snug">
            The most popular peer to peer lending at SEA
          </p>
        </div>

        <button
          type="button"
          className="w-fit bg-[#0575e6] text-white text-[14px] font-normal px-8 py-2 rounded-[30px] hover:bg-blue-500 transition-colors"
        >
          Read More
        </button>
      </div>
    </aside>
  );
}
