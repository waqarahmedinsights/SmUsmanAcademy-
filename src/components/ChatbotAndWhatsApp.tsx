import { FormEvent, useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const STARTER_QUESTIONS = [
  'What IELTS score is needed for UK Master’s?',
  'Explain Germany €0 tuition & Blocked Account',
  'Tell me about Gulshan-e-Iqbal & Shahrah-e-Faisal batches',
];

export function ChatbotAndWhatsApp() {
  const { config } = useSiteContent();
  const waNumber = config.socialLinks.whatsappNumber;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const leadEmail = config.socialLinks.leadEmail;

  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Assalam-o-Alaikum! Ask me about studying in the UK, Germany, Italy, or Cyprus, IELTS/PTE batches at SM Usman’s Academy, or visa requirements.',
    },
  ]);

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history: nextHistory.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await resp.json()) as { reply?: string; error?: string };
      const replyText =
        data.reply ||
        data.error ||
        `Unable to reach the AI advisor right now. Reach our team directly on WhatsApp ${waDisplay} or ${leadEmail}.`;

      setMessages((prev) => [
        ...prev,
        { id: `m-${Date.now()}`, role: 'model', text: replyText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'model',
          text: `Connection interrupted. Message our human advisors directly on WhatsApp ${waDisplay}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum SMU Consultants! I would like guidance on study abroad admissions and IELTS/PTE classes.'
  )}`;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5">
      {chatOpen && (
        <div
          role="dialog"
          aria-label="SMU AI Admissions Advisor"
          className="w-[min(92vw,370px)] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        >
          <div className="bg-[#0B2249] text-white px-4 py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold">SMU AI Study &amp; IELTS Advisor</p>
              <p className="text-[11px] text-slate-300">UK · Germany · Italy · Cyprus · IELTS/PTE</p>
            </div>
            <button
              type="button"
              aria-label="Close AI Advisor"
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F7FB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#DC1E25] text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500">
                  Drafting answer...
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-500">Quick Questions:</p>
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="block w-full text-left px-3 py-2 text-xs font-medium text-[#0B2249] bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about visas, IELTS, fees..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-200 rounded-lg text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-lg bg-[#0B2249] hover:bg-[#DC1E25] disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp ${waDisplay}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold shadow-lg transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setChatOpen((prev) => !prev)}
          aria-label="Open SMU AI Advisor Chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs sm:text-sm font-bold shadow-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#FBBF24]" />
          <span>AI Advisor</span>
        </button>
      </div>
    </div>
  );
}
