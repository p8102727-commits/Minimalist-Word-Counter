/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import WordCounter from './components/WordCounter';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-theme-accent selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 rounded-full border border-theme-border bg-theme-surface/60 backdrop-blur-[12px] text-theme-muted hover:text-theme-main transition-colors z-20 shadow-sm"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>

      {/* Background ambient glows for 3D depth */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-accent/[0.08] blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute top-[40%] right-[-5%] w-[40%] h-[60%] rounded-full bg-theme-accent/[0.06] blur-[140px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-[-20%] left-[15%] w-[45%] h-[45%] rounded-full bg-theme-accent/[0.08] blur-[120px] pointer-events-none transition-colors duration-300" />

      {/* 3D Floating Orbs */}
      <motion.div
         animate={{ 
             x: ["0vw", "30vw", "-10vw", "20vw", "0vw"],
             y: ["0vh", "-15vh", "30vh", "-5vh", "0vh"],
             scale: [1, 1.2, 0.9, 1.1, 1],
             opacity: [0.6, 0.9, 0.5, 0.8, 0.6]
         }}
         transition={{ duration: 25, ease: "easeInOut", repeat: Infinity }}
         className="absolute top-[30%] left-[30%] w-64 h-64 -ml-32 -mt-32 rounded-full pointer-events-none z-0"
         style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(217, 119, 87, 0.5) 0%, rgba(217, 119, 87, 0.15) 50%, transparent 75%)',
            filter: 'blur(12px)',
         }}
      />

      <motion.div
         animate={{ 
             x: ["0vw", "-35vw", "10vw", "-20vw", "0vw"],
             y: ["0vh", "20vh", "-25vh", "15vh", "0vh"],
             scale: [0.9, 1.1, 1.3, 1, 0.9],
             opacity: [0.5, 0.8, 0.6, 0.9, 0.5]
         }}
         transition={{ duration: 32, ease: "easeInOut", repeat: Infinity }}
         className="absolute top-[60%] left-[70%] w-72 h-72 -ml-36 -mt-36 rounded-full pointer-events-none z-0"
         style={{
            background: 'radial-gradient(circle at 65% 35%, rgba(139, 166, 193, 0.5) 0%, rgba(139, 166, 193, 0.15) 50%, transparent 75%)',
            filter: 'blur(12px)',
         }}
      />

      <div className="max-w-[720px] mx-auto space-y-16 relative z-10 text-theme-main">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pt-8"
        >
          <h1 className="text-[42px] font-semibold tracking-[-1px] text-theme-main transition-colors duration-300">Minimalist Word Counter</h1>
        </motion.header>

        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="space-y-16"
        >
          {/* Ad Placeholder 1 - Leaderboard style */}
          <div className="h-24 bg-theme-panel backdrop-blur-[12px] rounded-[20px] border border-theme-overlay/10 shadow-sm flex items-center justify-center text-theme-muted text-xs uppercase tracking-widest transition-all">
            Ad Leaderboard
          </div>

          <section>
            <WordCounter />
          </section>

          {/* Ad Placeholder 2 - Medium Rectangle style */}
          <div className="h-48 bg-theme-panel backdrop-blur-[12px] rounded-[20px] border border-theme-overlay/10 shadow-sm flex items-center justify-center text-theme-muted text-xs uppercase tracking-widest transition-all">
            Ad Rectangle
          </div>
          
          {/* Informational Section (Publisher Content for AdSense) */}
          <section className="bg-theme-panel backdrop-blur-[12px] rounded-[24px] border border-theme-overlay/10 shadow-sm p-8 space-y-6 mt-16 text-theme-main transition-all">
            <h2 className="text-2xl font-semibold tracking-tight">About Minimalist Word Counter</h2>
            <p className="leading-relaxed text-theme-muted">
              Whether you are an author writing your next novel, a student working on an essay, or an SEO specialist optimizing web content, keeping track of your text metrics is essential. The Minimalist Word Counter is designed to be a distraction-free, elegant workspace for analyzing your writing in real time. It goes beyond simple word counting to provide valuable insights into your text's structure, readability, and content focus.
            </p>
            
            <h3 className="text-xl font-medium tracking-tight mt-6">Why Monitor Your Word Count?</h3>
            <ul className="list-disc pl-5 space-y-3 text-theme-muted">
              <li><strong>SEO Optimization:</strong> Search engines often favor comprehensive, in-depth content. Tracking word counts ensures you meet the ideal length for better ranking potential and organic traffic.</li>
              <li><strong>Academic Requirements:</strong> Strict word limits are common for essays, dissertations, and research papers. This tool helps you trim unnecessary words or expand your arguments to hit the exact target seamlessly.</li>
              <li><strong>Reading Time Analysis:</strong> We provide an estimated reading time to help you tailor your content for your audience. Shorter reading times are ideal for social media or newsletters, while longer ones suit detailed guides.</li>
            </ul>

            <h3 className="text-xl font-medium tracking-tight mt-6">Key Features Built for Writers</h3>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-theme-sec p-4 rounded-xl border border-theme-border/50">
                <strong className="block text-sm uppercase tracking-wider mb-1">Density Analysis</strong>
                <span className="text-sm text-theme-muted">Identify overused words with our Top Word Frequency chart and maintain varied vocabulary.</span>
              </div>
              <div className="bg-theme-sec p-4 rounded-xl border border-theme-border/50">
                <strong className="block text-sm uppercase tracking-wider mb-1">Target Goals</strong>
                <span className="text-sm text-theme-muted">Set up custom goals with an intuitive progress bar that fills as you hit your milestones.</span>
              </div>
              <div className="bg-theme-sec p-4 rounded-xl border border-theme-border/50">
                <strong className="block text-sm uppercase tracking-wider mb-1">Voice Typing</strong>
                <span className="text-sm text-theme-muted">Use the built-in microphone feature to dictate text directly into the analyzer efficiently.</span>
              </div>
              <div className="bg-theme-sec p-4 rounded-xl border border-theme-border/50">
                <strong className="block text-sm uppercase tracking-wider mb-1">Export Ready</strong>
                <span className="text-sm text-theme-muted">Save your work effortlessly by downloading it as a standard .txt or formatted .pdf file.</span>
              </div>
            </div>
          </section>
        </motion.main>
      </div>
    </div>
  );
}
