interface TestBrandLogoProps {
  id: 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet' | 'british-council' | 'english';
  size?: 'sm' | 'md' | 'lg';
}

export function TestBrandLogo({ id, size = 'md' }: TestBrandLogoProps) {
  const containerCls =
    size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-14 px-4' : 'h-12 px-3.5';
  const ieltsFrameCls =
    size === 'sm' ? 'h-9' : size === 'lg' ? 'h-14' : 'h-12';
  const imgHeightCls =
    size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';
  const wideWordmarkHeightCls =
    size === 'sm' ? 'h-5' : size === 'lg' ? 'h-9' : 'h-7';

  switch (id) {
    case 'ielts':
      return (
        <div
          className={`${ieltsFrameCls} inline-flex items-center justify-center rounded-lg overflow-hidden bg-[#E31837] border border-[#B9151B]/30 shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/ielts.svg"
            alt="Official IELTS Logo"
            className="h-full w-auto block object-contain"
          />
        </div>
      );

    case 'pte':
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-2 justify-center rounded-xl bg-[#005A70] border border-[#004455] shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/pearson_pte.svg"
            alt="Official Pearson PTE Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
          <span
            className={`font-display font-extrabold text-white tracking-tight ${
              size === 'lg' ? 'text-base' : 'text-xs sm:text-sm'
            }`}
          >
            PTE
          </span>
        </div>
      );

    case 'duolingo':
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-2 justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/duolingo_wordmark.svg"
            alt="Duolingo English Test Official Logo"
            className={`${imgHeightCls} w-auto object-contain rounded`}
          />
          <span
            className={`font-display font-extrabold text-[#58CC02] tracking-tight ${
              size === 'lg' ? 'text-base' : 'text-xs sm:text-sm'
            }`}
          >
            duolingo
          </span>
        </div>
      );

    case 'toefl':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/toefl.svg"
            alt="ETS TOEFL Official Logo"
            className={`${wideWordmarkHeightCls} w-auto object-contain`}
          />
        </div>
      );

    case 'oet':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/oet.svg"
            alt="Official OET Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
        </div>
      );

    case 'british-council':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/british_council.svg"
            alt="British Council Official Logo"
            className={`${wideWordmarkHeightCls} w-auto object-contain`}
          />
        </div>
      );

    default:
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-2 justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0`}
        >
          <img
            src="/assets/smusman/smusman_site_logo.png"
            alt="SM Usman's Academy Spoken English"
            className={`${imgHeightCls} w-auto object-contain`}
          />
          <span className="font-display text-xs font-extrabold text-[#0B2249]">
            ENGLISH
          </span>
        </div>
      );
  }
}
