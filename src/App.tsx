/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import WordCounter from './components/WordCounter';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-[#D97757] selection:text-white transition-colors duration-300">
      <div className="max-w-[720px] mx-auto space-y-16">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pt-8"
        >
          <h1 className="text-[42px] font-semibold tracking-[-1px] text-[#222222]">Analysis</h1>
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
