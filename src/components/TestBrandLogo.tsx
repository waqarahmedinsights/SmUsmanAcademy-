interface TestBrandLogoProps {
  id: 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet' | 'british-council' | 'english';
  size?: 'sm' | 'md' | 'lg';
}

export function TestBrandLogo({ id, size = 'md' }: TestBrandLogoProps) {
  const containerCls =
    size === 'sm'
      ? 'h-9 px-2.5 max-w-full'
      : size === 'lg'
        ? 'h-14 px-4 max-w-full'
        : 'h-11 px-3 max-w-full';

  const ieltsFrameCls =
    size === 'sm'
      ? 'h-9 max-w-full'
      : size === 'lg'
        ? 'h-14 max-w-full'
        : 'h-11 max-w-full';

  const imgHeightCls =
    size === 'sm' ? 'h-5' : size === 'lg' ? 'h-9' : 'h-6';

  const pteHeightCls =
    size === 'sm' ? 'h-3.5' : size === 'lg' ? 'h-6' : 'h-4';

  const wordmarkHeightCls =
    size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';

  switch (id) {
    case 'ielts':
      return (
        <div
          className={`${ieltsFrameCls} inline-flex items-center justify-center rounded-lg overflow-hidden bg-[#E31837] shadow-xs shrink-0`}
        >
          <img
            src="/assets/logos/ielts.svg"
            alt="Official IELTS Logo"
            className="h-full w-auto max-w-full block object-contain"
          />
        </div>
      );

    case 'pte':
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-1.5 justify-center rounded-xl bg-[#005A70] border border-[#004455] shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/logos/pearson_pte.svg"
            alt="Official Pearson PTE Logo"
            className={`${pteHeightCls} w-auto max-w-[72%] object-contain shrink`}
          />
          <span
            className={`font-display font-extrabold text-white tracking-tight shrink-0 ${
              size === 'lg' ? 'text-sm' : 'text-[11px]'
            }`}
          >
            PTE
          </span>
        </div>
      );

    case 'duolingo':
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-1.5 justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/logos/duolingo_wordmark.svg"
            alt="Duolingo English Test Official Logo"
            className={`${imgHeightCls} w-auto object-contain rounded shrink-0`}
          />
          <span
            className={`font-display font-extrabold text-[#58CC02] tracking-tight shrink-0 ${
              size === 'lg' ? 'text-base' : 'text-xs'
            }`}
          >
            duolingo
          </span>
        </div>
      );

    case 'toefl':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/logos/toefl.svg"
            alt="ETS TOEFL Official Logo"
            className={`${wordmarkHeightCls} w-auto max-w-full object-contain`}
          />
        </div>
      );

    case 'oet':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/logos/oet.svg"
            alt="Official OET Logo"
            className={`${imgHeightCls} w-auto max-w-full object-contain`}
          />
        </div>
      );

    case 'british-council':
      return (
        <div
          className={`${containerCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/logos/british_council.svg"
            alt="British Council Official Logo"
            className={`${wordmarkHeightCls} w-auto max-w-full object-contain`}
          />
        </div>
      );

    default:
      return (
        <div
          className={`${containerCls} inline-flex items-center gap-2 justify-center rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 overflow-hidden`}
        >
          <img
            src="/assets/smusman/smusman_site_logo.png"
            alt="SM Usman's Academy Spoken English"
            className={`${imgHeightCls} w-auto object-contain`}
          />
          <span className="font-display text-xs font-extrabold text-[#0B2249] shrink-0">
            ENGLISH
          </span>
        </div>
      );
  }
}
