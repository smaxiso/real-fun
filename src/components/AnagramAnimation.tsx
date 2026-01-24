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

    // Helper to group letters into words for rendering
    const renderWords = () => {
        const words: Letter[][] = [];
        let currentWord: Letter[] = [];

        letters.forEach((letter) => {
            if (letter.char === ' ') {
                if (currentWord.length > 0) {
                    words.push(currentWord);
                    currentWord = [];
                }
                // We don't push the space itself into a word, but we might need spacing between words.
                // Alternatively, we can treat the space as a separator.
            } else {
                currentWord.push(letter);
            }
        });
        if (currentWord.length > 0) {
            words.push(currentWord);
        }

        return (
            <div className="flex flex-wrap justify-center gap-x-[0.5em] gap-y-2">
                {words.map((word, wordIndex) => (
                    <div key={`word-${wordIndex}`} className="flex flex-wrap justify-center">
                        {word.map((letter) => (
                            <motion.div
                                layoutId={letter.id}
                                key={letter.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: stage === 'end' ? 1.2 : 1,
                                    textShadow: stage === 'end'
                                        ? "0 0 10px rgba(0, 255, 200, 0.8), 0 0 20px rgba(0, 255, 200, 0.4)"
                                        : "0 0 0px transparent",
                                    color: stage === 'end' ? '#a5f3fc' : '#e2e8f0'
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{
                                    type: "tween",
                                    ease: "easeInOut",
                                    duration: 3,
                                    delay: stage === 'end' ? Math.random() * 1.5 : 0
                                }}
                                className="relative inline-block"
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
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="text-center font-serif text-[clamp(1.5rem,5vw,3.5rem)] tracking-widest min-h-[100px] perspective-1000 px-4 leading-tight flex items-center justify-center">
            <AnimatePresence mode='popLayout'>
                {letters.length > 0 && renderWords()}
            </AnimatePresence>
        </div>
    );
};
