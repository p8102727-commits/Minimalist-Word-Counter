/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import WordCounter from './components/WordCounter';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-[#D97757] selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glows for 3D depth */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D97757]/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-5%] w-[40%] h-[60%] rounded-full bg-[#D97757]/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[15%] w-[45%] h-[45%] rounded-full bg-[#D97757]/[0.08] blur-[120px] pointer-events-none" />

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
            background: 'radial-gradient(circle at 35% 35%, rgba(217, 119, 87, 0.5) 0%, rgba(217, 119, 87, 0.15) 50%, rgba(217, 119, 87, 0) 75%)',
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
            background: 'radial-gradient(circle at 65% 35%, rgba(139, 166, 193, 0.5) 0%, rgba(139, 166, 193, 0.15) 50%, rgba(139, 166, 193, 0) 75%)',
            filter: 'blur(12px)',
         }}
      />

      <div className="max-w-[720px] mx-auto space-y-16 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pt-8"
        >
          <h1 className="text-[42px] font-semibold tracking-[-1px] text-[#222222]">Minimalist Word Counter</h1>
        </motion.header>

        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="space-y-16"
        >
          {/* Ad Placeholder 1 - Leaderboard style */}
          <div className="h-24 bg-white/60 backdrop-blur-[12px] rounded-[20px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#777777] text-xs uppercase tracking-widest transition-all hover:bg-white/80">
            Ad Leaderboard
          </div>

          <section>
            <WordCounter />
          </section>

          {/* Ad Placeholder 2 - Medium Rectangle style */}
          <div className="h-48 bg-white/60 backdrop-blur-[12px] rounded-[20px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#777777] text-xs uppercase tracking-widest transition-all hover:bg-white/80">
            Ad Rectangle
          </div>
        </motion.main>
      </div>
    </div>
  );
}
