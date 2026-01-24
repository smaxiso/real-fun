import { useState, useEffect } from 'react';
import { riddles } from './data/riddles';
import { Quiz } from './components/Quiz';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

function App() {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [isRiddleSolved, setIsRiddleSolved] = useState(false);
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    // Cinematic intro timer
    const timer = setTimeout(() => {
      setIsIntro(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

  // Logo Animation Variants
  const logoVariants: Variants = {
    intro: {
      opacity: 1,
      scale: 1,
      filter: "drop-shadow(0 0 50px rgba(34,211,238,0.6))",
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    watermark: {
      opacity: [0.01, 0.1, 0.01],
      scale: [0.9, 1, 0.9],
      rotate: [0, 2, -2, 0],
      filter: "drop-shadow(0 0 30px rgba(34,211,238,0.1))",
      transition: {
        opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        filter: { duration: 0.5 } // quick transition for filter
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0">
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

        {/* Logo (Intro Splash -> Watermark) */}
        <motion.img
          src="/logo.png"
          alt="The Riddle Diary Logo"
          variants={logoVariants}
          initial="intro"
          animate={isIntro ? "intro" : "watermark"}
          className="w-[90vw] md:w-[800px] object-contain mix-blend-screen z-0"
        />
      </div>

      {/* Main Content (Fades in after intro) */}
      <AnimatePresence>
        {!isIntro && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 w-full flex flex-col items-center"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
