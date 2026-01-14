import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnagramAnimationProps {
    startText: string;
    endText: string;
    trigger: boolean;
    onAnimationComplete?: () => void;
}

interface Letter {
    char: string;
    id: string; // Unique ID to track the letter movement
    targetIndex?: number;
}

export const AnagramAnimation: React.FC<AnagramAnimationProps> = ({
    startText,
    endText,
    trigger,
    onAnimationComplete,
}) => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [stage, setStage] = useState<'start' | 'scramble' | 'end'>('start');

    useEffect(() => {
        // Initialize start letters
        const initialLetters = startText.split('').map((char, index) => ({
            char,
            id: `start-${index}-${char}`,
        }));
        setLetters(initialLetters);
        setStage('start');
    }, [startText]);

    useEffect(() => {
        if (trigger && stage === 'start') {
            performAnimation();
        }
    }, [trigger, stage]);

    const performAnimation = async () => {
        // 1. Calculations
        const sourceChars = startText.split('');
        const targetChars = endText.split('');

        // Create a pool of available source letters to map to target
        const availableSourceIndices = sourceChars.map((_, i) => i);
        const newLetters: Letter[] = [];

        // Map target letters to source letters
        targetChars.forEach((targetChar, targetIdx) => {
            // Find a matching character in source that hasn't been used
            const sourceMatchIndex = availableSourceIndices.findIndex(
                (idx) => sourceChars[idx].toLowerCase() === targetChar.toLowerCase()
            );

            if (sourceMatchIndex !== -1) {
                // Reusing a letter from the start word
                const originalIdx = availableSourceIndices[sourceMatchIndex];
                newLetters.push({
                    char: targetChar, // Use target casing
                    id: `start-${originalIdx}-${sourceChars[originalIdx]}`, // Keep original ID for layout animation
                    targetIndex: targetIdx
                });
                availableSourceIndices.splice(sourceMatchIndex, 1);
            } else {
                // New letter appearing (if any - ideally riddles are perfect anagrams, but handle cases)
                newLetters.push({
                    char: targetChar,
                    id: `new-${targetIdx}-${targetChar}`,
                    targetIndex: targetIdx
                });
            }
        });

        // Handle leftover source letters (they should fade out) for non-perfect anagrams
        // For now assuming perfect anagrams or just handled by filtering

        setStage('scramble');

        // Add small delay before moving
        await new Promise(r => setTimeout(r, 500));

        setLetters(newLetters);
        setStage('end');

        setTimeout(() => {
            onAnimationComplete?.();
        }, 2000); // Wait for transition to finish
    };

    return (
        <div className="text-center font-serif text-3xl md:text-5xl tracking-widest min-h-[100px] perspective-1000 break-words px-4">
            <AnimatePresence>
                {letters.map((letter) => (
                    <motion.div
                        layoutId={letter.id} // This is the magic of framer motion shared layout
                        key={letter.id}
                        initial={false}
                        animate={{
                            scale: stage === 'end' ? 1.2 : 1,
                            textShadow: stage === 'end'
                                ? "0 0 10px rgba(0, 255, 200, 0.8), 0 0 20px rgba(0, 255, 200, 0.4)"
                                : "0 0 0px transparent",
                            color: stage === 'end' ? '#a5f3fc' : '#e2e8f0'
                        }}
                        transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 3,
                            delay: stage === 'end' ? Math.random() * 1.5 : 0 // Randomize the flight start more for floaty feel
                        }}
                        className="inline-block mx-1 relative"
                        style={{
                            width: letter.char === ' ' ? '0.5rem' : 'auto',
                            display: 'inline-block'
                        }}
                    >
                        {letter.char}
                        {stage === 'end' && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 bg-white blur-lg rounded-full"
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
