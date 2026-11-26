import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, MailCheck, X } from 'lucide-react';

export interface LeadToastPayload {
  id: string;
  referenceId: string;
  title?: string;
  message: string;
  emailDelivered?: boolean;
}

interface LeadToastProps {
  toast: LeadToastPayload | null;
  onDismiss: () => void;
}

export function LeadToast({ toast, onDismiss }: LeadToastProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-20 right-4 left-4 sm:left-auto sm:w-[410px] z-[60] pointer-events-none"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#0B2249] text-white border-2 border-emerald-400/80 rounded-2xl shadow-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm font-extrabold text-white">
                  {toast.title || 'Application Received!'}
                </p>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#FBBF24] text-[#0B2249] tabular-nums">
                  {toast.referenceId}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">{toast.message}</p>

              {toast.emailDelivered && (
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 pt-0.5">
                  <MailCheck className="w-3.5 h-3.5 shrink-0" />
                  Receipt logged in Admin Portal &amp; dispatched via email
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss confirmation notification"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
