import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WordCounter() {
  const [text, setText] = useState(() => localStorage.getItem('wordCounterText') || '');
  const [clearing, setClearing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    localStorage.setItem('wordCounterText', text);
  }, [text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const paragraphs = text.trim() ? text.trim().split(/\n\n+/).filter(p => p.trim()).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const avgSentenceLength = words / (sentences || 1);
  const difficulty = avgSentenceLength === 0 ? '-' : avgSentenceLength < 15 ? 'Beginner' : avgSentenceLength < 25 ? 'Intermediate' : 'Advanced';
  const readingTime = Math.ceil(words / 200);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClear = () => {
    setClearing(true);
    setTimeout(() => {
      setText('');
      setClearing(false);
    }, 250); 
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <motion.div 
        className={`bg-white rounded-[24px] border transition-all duration-300 overflow-hidden flex flex-col ${isFocused ? 'border-[#D97757]/30 ring-4 ring-[#D97757]/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'border-[#E7E2DA] shadow-[0_4px_20px_rgba(0,0,0,0.04)]'}`}
      >
        <textarea
          value={clearing ? '' : text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What do you want to analyze?"
          className="w-full min-h-[360px] p-8 text-[16px] leading-[1.7] text-[#222222] placeholder-[#A09B93] bg-transparent border-none outline-none resize-none transition-opacity"
          style={{ opacity: clearing ? 0 : 1 }}
          disabled={clearing}
        />
        
        {/* Footer of the input area */}
        <div className="px-8 py-4 bg-white border-t border-[#E7E2DA]/50 flex justify-end gap-6 items-center">
             <button onClick={handleCopy} className="text-[13px] font-medium text-[#777777] hover:text-[#222222] transition-colors">Copy</button>
             <motion.button 
               onClick={handleClear} 
               whileTap={{ scale: 0.95 }} 
               className="text-[13px] font-medium text-[#D97757] hover:text-[#B36045] transition-colors"
             >
               Clear
             </motion.button>
        </div>
      </motion.div>

      {/* Stats Card */}
      <AnimatePresence>
        {text.trim().length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-8 bg-white/60 backdrop-blur-[12px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6"
          >
             <StatBox label="Words" value={words} />
             <StatBox label="Characters" value={characters} />
             <StatBox label="Paragraphs" value={paragraphs} />
             <StatBox label="Est. Reading" value={`${readingTime} min`} />
             <StatBox label="Difficulty" value={difficulty} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-[#777777] uppercase tracking-[0.06em]">{label}</span>
      <span className="text-2xl font-semibold text-[#222222] tracking-tight">{value}</span>
    </div>
  );
}
