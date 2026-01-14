import React, { useState } from 'react';
import { riddles } from './data/riddles';
import { Quiz } from './components/Quiz';
import { motion } from 'framer-motion';

function App() {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [isRiddleSolved, setIsRiddleSolved] = useState(false);

  const handleNext = () => {
    setIsRiddleSolved(false);
    setCurrentRiddleIndex((prev) => (prev + 1) % riddles.length);
  };

  const handlePrev = () => {
    setIsRiddleSolved(false);
    setCurrentRiddleIndex((prev) => (prev - 1 + riddles.length) % riddles.length);
  };

  const handleSolve = () => {
    setIsRiddleSolved(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">

      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Fog 1 */}
        <motion.div
          animate={{ x: [-100, 100] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen"
        />
        {/* Fog 2 */}
        <motion.div
          animate={{ x: [100, -100] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[140px] mix-blend-screen"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <header className="w-full p-6 text-center flex flex-col items-center justify-center">
          <h1 className="font-serif text-white/20 tracking-[0.5em] text-xs mb-2">THE RIDDLE DIARY</h1>
          {isRiddleSolved && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 font-serif text-xl italic"
            >
              "Mischief Managed"
            </motion.p>
          )}
        </header>

        <Quiz
          key={currentRiddleIndex} // Force re-render on riddle change
          riddle={riddles[currentRiddleIndex]}
          onNext={handleNext}
          onPrev={handlePrev}
          onSolve={handleSolve}
        />
      </div>

    </div>
  );
}

export default App;
