export function BrandPanel() {
  return (
    <aside className="hidden lg:flex relative w-[860px] flex-shrink-0 flex-col justify-center overflow-hidden bg-gradient-to-b from-brand via-brand-dark to-brand-darker">
      {/* Decorative circle outlines — bottom left */}
      <div className="pointer-events-none absolute -bottom-16 -left-52 w-[638px] h-[583px]">
        <svg
          viewBox="0 0 638 583"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-30"
        >
          <circle cx="207" cy="431" r="180" stroke="white" strokeWidth="1.5" />
          <circle cx="207" cy="431" r="280" stroke="white" strokeWidth="1.5" />
          <circle cx="207" cy="431" r="380" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 px-20 mt-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-heading font-bold text-brand-fg leading-tight tracking-tight">
            GoFinance
          </h1>
          <p className="text-lead font-medium text-brand-fg leading-snug">
            The most popular peer to peer lending at SEA
          </p>
        </div>

        <button type="button" className="ds-btn-brand w-fit">
          Read More
        </button>
      </div>
    </aside>
  );
}
