import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function WordCounter() {
  const [text, setText] = useState(() => localStorage.getItem('wordCounterText') || '');
  const [targetCount, setTargetCount] = useState(() => localStorage.getItem('wordCounterTarget') || '');
  const [clearing, setClearing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...'>('Saved');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-save changes to localStorage & trigger indicator
  useEffect(() => {
    localStorage.setItem('wordCounterText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('wordCounterTarget', targetCount);
  }, [targetCount]);

  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      setSaveStatus('Saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [text, targetCount]);

  // Web Speech API / Dictation Handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Web Speech API is not supported in this browser. Please try Chrome, Edge, or Safari.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        setText(prev => prev + (prev.trim() ? ' ' : '') + transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Helper to extract top words with their counts
  const getTopWordsData = (val: string, limit: number = 5) => {
    if (!val.trim()) return [];
    const freqMap: Record<string, number> = {};
    const wordTokens = val.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const stopWords = new Set([
      'the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'i', 'it', 'for', 'you', 'was', 'with', 
      'on', 'as', 'have', 'but', 'we', 'they', 'be', 'this', 'are', 'or', 'not', 'at', 'from', 
      'by', 'an', 'what', 'so', 'if', 'all', 'there', 'their', 'can', 'will', 'my', 'your', 'me', 
      'our', 'us', 'its', 'he', 'she', 'his', 'her', 'them'
    ]);
    wordTokens.forEach(w => {
      if (!stopWords.has(w) && w.length > 2) {
        freqMap[w] = (freqMap[w] || 0) + 1;
      }
    });
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }));
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const paragraphs = text.trim() ? text.trim().split(/\n\n+/).filter(p => p.trim()).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const avgSentenceLength = words / (sentences || 1);
  const difficulty = avgSentenceLength === 0 ? '-' : avgSentenceLength < 15 ? 'Beginner' : avgSentenceLength < 25 ? 'Intermediate' : 'Advanced';
  const readingTime = Math.ceil(words / 200);

  // Stats analysis calculations
  const top5WordsData = getTopWordsData(text, 5);
  const top3WordsList = top5WordsData.slice(0, 3).map(w => w.name);
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
        className={`bg-theme-surface rounded-[24px] border transition-all duration-300 overflow-hidden flex flex-col ${isFocused ? 'border-theme-accent/30 ring-4 ring-theme-accent/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'border-theme-border shadow-sm'}`}
      >
        <textarea
          value={clearing ? '' : text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What do you want to analyze?"
          className="w-full min-h-[360px] p-8 text-[16px] leading-[1.7] text-theme-main placeholder-theme-muted/60 bg-transparent border-none outline-none resize-none transition-opacity"
          style={{ opacity: clearing ? 0 : 1 }}
          disabled={clearing}
        />
        
        {/* Footer of the input area */}
        <div className="px-8 py-4 bg-theme-sec border-t border-theme-border/50 flex flex-wrap justify-between gap-4 items-center">
             <div className="flex flex-wrap gap-4 items-center">
               <button onClick={handlePaste} className="text-[13px] font-medium text-theme-muted hover:text-theme-main transition-colors">Paste</button>
               <button onClick={handleExportTxt} className="text-[13px] font-medium text-theme-muted hover:text-theme-main transition-colors">Export .txt</button>
               <button onClick={handleExportPdf} className="text-[13px] font-medium text-theme-muted hover:text-theme-main transition-colors">Export .pdf</button>
             </div>
             
             <div className="flex gap-4 items-center">
               {/* Auto-saved status indicator */}
               <div className="flex items-center gap-1.5 mr-2">
                 <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${saveStatus === 'Saving...' ? 'bg-amber-400' : 'bg-green-500'}`} />
                 <span className="text-[11px] font-medium text-theme-muted select-none">{saveStatus}</span>
               </div>

               {/* Dictation Microphone Toggle */}
               <button 
                 onClick={toggleListening} 
                 className={`p-2 rounded-full transition-all flex items-center justify-center relative ${isListening ? 'bg-red-500/10 text-red-500' : 'text-theme-muted hover:text-theme-main hover:bg-theme-border/20'}`}
                 title={isListening ? "Stop listening" : "Start dictating"}
                 aria-label={isListening ? "Stop listening" : "Start dictating"}
               >
                 {isListening ? (
                   <>
                     <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                     <Mic className="w-4 h-4 text-red-500 relative z-10" />
                   </>
                 ) : (
                   <Mic className="w-4 h-4" />
                 )}
               </button>

               <button onClick={handleCopy} className="text-[13px] font-medium text-theme-muted hover:text-theme-main transition-colors">Copy</button>
               <motion.button 
                 onClick={handleClear} 
                 whileTap={{ scale: 0.95 }} 
                 className="text-[13px] font-medium text-theme-accent hover:opacity-80 transition-colors"
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
            className="p-8 bg-theme-panel backdrop-blur-[12px] rounded-[24px] border border-theme-overlay/10 shadow-sm flex flex-col gap-8"
          >
             <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
               <StatBox label="Words" value={words} />
               <StatBox label="Characters" value={characters} />
               <StatBox label="Paragraphs" value={paragraphs} />
               <StatBox label="Est. Reading" value={`${readingTime} min`} />
               <StatBox label="Difficulty" value={difficulty} />
               {top3WordsList.length > 0 && (
                 <div className="flex flex-col gap-2">
                   <span className="text-[11px] font-medium text-theme-muted uppercase tracking-[0.06em]">Top 3 Words</span>
                   <span className="text-lg font-semibold text-theme-main tracking-tight capitalize">{top3WordsList.join(', ')}</span>
                 </div>
               )}
             </div>

             {/* Recharts Bar Chart Visualization of Top 5 words */}
             {top5WordsData.length > 0 && (
               <div className="pt-6 border-t border-theme-border/50 flex flex-col gap-4">
                 <div className="flex flex-col gap-1">
                   <span className="text-[11px] font-medium text-theme-muted uppercase tracking-[0.06em]">Word Frequency (Top 5)</span>
                 </div>
                 <div className="w-full h-44">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={top5WordsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                       <XAxis 
                         dataKey="name" 
                         stroke="var(--theme-muted)" 
                         fontSize={11} 
                         tickLine={false} 
                         axisLine={false} 
                       />
                       <YAxis 
                         stroke="var(--theme-muted)" 
                         fontSize={11} 
                         tickLine={false} 
                         axisLine={false} 
                         allowDecimals={false}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: 'var(--theme-surface)', 
                           borderColor: 'rgba(var(--theme-overlay), 0.1)',
                           borderRadius: '8px',
                           fontSize: '12px',
                           color: 'var(--theme-main)' 
                         }}
                         cursor={{ fill: 'rgba(var(--theme-accent), 0.05)' }}
                       />
                       <Bar dataKey="value" fill="var(--theme-accent)" radius={[4, 4, 0, 0]} maxBarSize={32}>
                         {top5WordsData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill="var(--theme-accent)" opacity={1 - index * 0.15} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             )}

             {/* Personal Target Section with Progress bar */}
             <div className="pt-6 border-t border-theme-border/50 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <span className="text-[13px] font-medium text-theme-muted">Target Word Count</span>
                 <input 
                   type="number" 
                   value={targetCount} 
                   onChange={(e) => setTargetCount(e.target.value)} 
                   placeholder="e.g. 500" 
                   className="w-24 px-3 py-1.5 text-sm bg-theme-sec border border-theme-border rounded-lg text-theme-main outline-none focus:border-theme-accent/50 focus:ring-2 focus:ring-theme-accent/10 transition-all font-medium placeholder:text-theme-muted/50" 
                 />
               </div>
               
               {targetWords > 0 && (
                 <div className="space-y-1.5">
                   <div className="h-2 w-full bg-theme-border/50 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progressPercent}%` }}
                       transition={{ duration: 0.4, ease: "easeOut" }}
                       className={`h-full ${progressPercent >= 100 ? 'bg-green-500' : 'bg-theme-accent'}`}
                     />
                   </div>
                   <div className="flex justify-between text-[11px] font-medium text-theme-muted uppercase tracking-[0.06em]">
                     <span>Progress</span>
                     <span>{words} / {targetWords} words ({Math.round(progressPercent)}%)</span>
                   </div>
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
      <span className="text-[11px] font-medium text-theme-muted uppercase tracking-[0.06em]">{label}</span>
      <span className="text-2xl font-semibold text-theme-main tracking-tight">{value}</span>
    </div>
  );
}
