interface TestBrandLogoProps {
  id: 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet' | 'british-council' | 'english';
  size?: 'sm' | 'md' | 'lg';
}

export function TestBrandLogo({ id, size = 'md' }: TestBrandLogoProps) {
  const heightCls =
    size === 'sm' ? 'h-8 px-2.5' : size === 'lg' ? 'h-14 px-4' : 'h-11 px-3';
  const imgHeightCls =
    size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';

  switch (id) {
    case 'ielts':
      return (
        <div
          className={`${heightCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
        >
          <img
            src="/assets/logos/ielts.svg"
            alt="Official IELTS Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
        </div>
      );

    case 'pte':
      return (
        <div
          className={`${heightCls} inline-flex items-center gap-2 justify-center rounded-xl bg-[#005A70] border border-[#004455] shadow-xs`}
        >
          <img
            src="/assets/logos/pearson_pte.svg"
            alt="Official Pearson PTE Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
          <span className="font-display text-xs sm:text-sm font-extrabold text-white tracking-tight">
            PTE
          </span>
        </div>
      );

    case 'duolingo':
      return (
        <div
          className={`${heightCls} inline-flex items-center gap-2 justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
        >
          <img
            src="/assets/logos/duolingo_wordmark.svg"
            alt="Duolingo English Test Official Logo"
            className={`${imgHeightCls} w-auto object-contain rounded`}
          />
          <span className="font-display text-xs sm:text-sm font-extrabold text-[#58CC02] tracking-tight">
            duolingo
          </span>
        </div>
      );

    case 'toefl':
      return (
        <div
          className={`${heightCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
        >
          <img
            src="/assets/logos/toefl.svg"
            alt="ETS TOEFL Official Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
        </div>
      );

    case 'oet':
      return (
        <div
          className={`${heightCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
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
          className={`${heightCls} inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
        >
          <img
            src="/assets/logos/british_council.svg"
            alt="British Council Official Logo"
            className={`${imgHeightCls} w-auto object-contain`}
          />
        </div>
      );

    default:
      return (
        <div
          className={`${heightCls} inline-flex items-center gap-2 justify-center rounded-xl bg-white border border-slate-200 shadow-xs`}
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
