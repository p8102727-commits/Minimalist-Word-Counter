import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WordCounter() {
  const [text, setText] = useState(() => localStorage.getItem('wordCounterText') || '');
  const [targetCount, setTargetCount] = useState(() => localStorage.getItem('wordCounterTarget') || '');
  const [clearing, setClearing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    localStorage.setItem('wordCounterText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('wordCounterTarget', targetCount);
  }, [targetCount]);

  const getTopWords = (val: string) => {
    if (!val.trim()) return [];
    const freqMap: Record<string, number> = {};
    const wordTokens = val.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const stopWords = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'i', 'it', 'for', 'you', 'was', 'with', 'on', 'as', 'have', 'but', 'we', 'they', 'be', 'this', 'are', 'or', 'not', 'at', 'from', 'by', 'an', 'what', 'so', 'if', 'all', 'there', 'their', 'can', 'will']);
    wordTokens.forEach(w => {
      if (!stopWords.has(w) && w.length > 2) {
        freqMap[w] = (freqMap[w] || 0) + 1;
      }
    });
    return Object.entries(freqMap)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const paragraphs = text.trim() ? text.trim().split(/\n\n+/).filter(p => p.trim()).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const avgSentenceLength = words / (sentences || 1);
  const difficulty = avgSentenceLength === 0 ? '-' : avgSentenceLength < 15 ? 'Beginner' : avgSentenceLength < 25 ? 'Intermediate' : 'Advanced';
  const readingTime = Math.ceil(words / 200);
  const topWords = getTopWords(text);
  const targetWords = parseInt(targetCount, 10) || 0;
  const progressPercent = targetWords > 0 ? Math.min((words / targetWords) * 100, 100) : 0;

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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(prev => (prev ? prev + '\n' : '') + clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleExportTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 15, 15);
    doc.save('Analysis.pdf');
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
        <div className="px-8 py-4 bg-[#FCFBF8] border-t border-[#E7E2DA]/50 flex justify-between gap-6 items-center">
             <div className="flex gap-4">
               <button onClick={handlePaste} className="text-[13px] font-medium text-[#777777] hover:text-[#222222] transition-colors">Paste</button>
               <button onClick={handleExportTxt} className="text-[13px] font-medium text-[#777777] hover:text-[#222222] transition-colors">Export .txt</button>
               <button onClick={handleExportPdf} className="text-[13px] font-medium text-[#777777] hover:text-[#222222] transition-colors">Export .pdf</button>
             </div>
             <div className="flex gap-4 items-center">
               <button onClick={handleCopy} className="text-[13px] font-medium text-[#777777] hover:text-[#222222] transition-colors">Copy</button>
               <motion.button 
                 onClick={handleClear} 
                 whileTap={{ scale: 0.95 }} 
                 className="text-[13px] font-medium text-[#D97757] hover:text-[#B36045] transition-colors"
               >
                 Clear
               </motion.button>
             </div>
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
            className="p-8 bg-white/60 backdrop-blur-[12px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-8"
          >
             <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
               <StatBox label="Words" value={words} />
               <StatBox label="Characters" value={characters} />
               <StatBox label="Paragraphs" value={paragraphs} />
               <StatBox label="Est. Reading" value={`${readingTime} min`} />
               <StatBox label="Difficulty" value={difficulty} />
               {topWords.length > 0 && (
                 <div className="flex flex-col gap-2">
                   <span className="text-[11px] font-medium text-[#777777] uppercase tracking-[0.06em]">Top Words</span>
                   <span className="text-lg font-semibold text-[#222222] tracking-tight">{topWords.join(', ')}</span>
                 </div>
               )}
             </div>

             <div className="pt-6 border-t border-[#E7E2DA]/50 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <span className="text-[13px] font-medium text-[#777777]">Target Word Count</span>
                 <input 
                   type="number" 
                   value={targetCount} 
                   onChange={(e) => setTargetCount(e.target.value)} 
                   placeholder="e.g. 500" 
                   className="w-24 px-3 py-1.5 text-sm bg-[#FCFBF8] border border-[#E7E2DA] rounded-lg text-[#222222] outline-none focus:border-[#D97757]/50 focus:ring-2 focus:ring-[#D97757]/10 transition-all font-medium" 
                 />
               </div>
               
               {targetWords > 0 && (
                 <div className="h-2 w-full bg-[#E7E2DA] rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressPercent}%` }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
                     className={`h-full ${progressPercent >= 100 ? 'bg-green-500' : 'bg-[#D97757]'}`}
                   />
                 </div>
               )}
             </div>
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
