import { useState } from 'react';
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
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

        {/* Logo Watermark */}
        <motion.img
          src="/logo.png"
          alt=""
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [0.9, 1, 0.9],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-[90vw] md:w-[800px] object-contain mix-blend-screen filter drop-shadow-[0_0_30px_rgba(34,211,238,0.1)]"
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
              className="text-emerald-300 font-hand text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(110,231,183,0.8)]"
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
          currentIndex={currentRiddleIndex + 1}
          totalRiddles={riddles.length}
        />
      </div>

    </div>
  );
}

export default App;
