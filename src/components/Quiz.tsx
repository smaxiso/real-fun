import React, { useState, useMemo } from 'react';
import { type Riddle } from '../data/riddles';
import { GlassCard } from './GlassCard';
import { AnagramAnimation } from './AnagramAnimation';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizProps {
    riddle: Riddle;
    onNext: () => void;
    onPrev: () => void;
    onSolve: () => void;
    currentIndex: number;
    totalRiddles: number;
}

export const Quiz: React.FC<QuizProps> = ({ riddle, onNext, onPrev, onSolve, currentIndex, totalRiddles }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);
    const [shake, setShake] = useState(false);

    console.log("Quiz Rendered", { riddle });

    const randomizedOptions = useMemo(() => {
        if (!riddle) return [];
        return [...riddle.options].sort(() => Math.random() - 0.5);
    }, [riddle]);

    if (!riddle) {
        console.error("Quiz received no riddle!");
        return <div>Error: No Riddle Data</div>;
    }

    const handleOptionClick = (option: string) => {
        if (showAnimation) return;

        setSelectedOption(option);

        if (option === riddle.answer) {
            setIsCorrect(true);
            setShowAnimation(true);
            onSolve(); // Notify parent that riddle is solved
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleSkip = () => {
        setSelectedOption(riddle.answer); // Force correct selection logic
        setIsCorrect(true);
        setShowAnimation(true);
        onSolve();
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-2 md:p-4 flex flex-col items-center gap-4 md:gap-8">

            {/* Question Area */}
            <GlassCard className="w-full text-center py-12 relative overflow-hidden">
                <div className="text-sm uppercase tracking-[0.3em] text-blue-200/50 mb-4">The Riddle</div>

                {showAnimation ? (
                    <AnagramAnimation
                        startText={riddle.question}
                        endText={riddle.answer}
                        trigger={true}
                    />
                ) : (
                    <h2 className="text-[clamp(1.5rem,5vw,3.5rem)] font-serif tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] px-2 break-words leading-tight">
                        {riddle.question}
                    </h2>
                )}

                {/* Progress Indicator - Inside the card for style */}
                <div className="absolute bottom-3 left-0 w-full text-center">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/20 font-serif">
                        Riddle {currentIndex} / {totalRiddles}
                    </span>
                </div>
            </GlassCard>

            {/* Options Area */}
            {!showAnimation && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {randomizedOptions.map((option) => (
                        <motion.button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            animate={shake && selectedOption === option ? { x: [-10, 10, -10, 10, 0] } : {}}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "min-h-[60px] p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 font-serif tracking-wider text-base md:text-lg flex items-center justify-center text-center leading-tight",
                                selectedOption === option && !isCorrect
                                    ? "bg-red-500/20 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200"
                            )}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Reveal and Navigation wrapper */}
            {!showAnimation && (
                <div className="w-full flex items-center justify-between gap-2 md:gap-8 px-2 md:px-4 mt-4">
                    <button
                        onClick={onPrev}
                        className="flex-1 min-w-0 px-2 md:px-4 py-3 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-full transition-all uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-1 md:gap-2"
                    >
                        <ArrowLeft size={14} className="shrink-0" /> Prev
                    </button>

                    <button
                        onClick={handleSkip}
                        className="flex-[1.5] min-w-0 px-2 md:px-4 py-3 text-[10px] md:text-xs text-white/30 hover:text-white/80 transition-colors uppercase tracking-widest flex items-center justify-center gap-1 md:gap-2 text-center whitespace-nowrap"
                    >
                        <Sparkles size={12} className="shrink-0" /> Reveal
                    </button>

                    <button
                        onClick={onNext}
                        className="flex-1 min-w-0 px-2 md:px-4 py-3 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-full transition-all uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-1 md:gap-2"
                    >
                        Skip <ArrowRight size={14} className="shrink-0" />
                    </button>
                </div>
            )}

            {/* Success State / Next Button */}
            {showAnimation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }} // Wait for anagram to finish approx
                    className="text-center"
                >
                    {/* Mischief Managed moved to App.tsx */}
                    <button
                        onClick={() => {
                            setShowAnimation(false);
                            setSelectedOption(null);
                            setIsCorrect(false);
                            onNext();
                        }}
                        className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        Next Riddle
                    </button>
                </motion.div>
            )}

        </div>
    );
};
