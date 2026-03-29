"use client";

import { motion } from "framer-motion";

interface SceneTransitionProps {
    children: React.ReactNode;
    type?: 'zoom' | 'fade' | 'slide' | 'cinematic';
}

export function SceneTransition({ children, type = 'cinematic' }: SceneTransitionProps) {
    const getVariants = () => {
        switch(type) {
            case 'zoom':
                return {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 1.1 }
                };
            case 'cinematic':
                return {
                    initial: { opacity: 0, filter: 'brightness(0) contrast(150%) blur(10px)' },
                    animate: { opacity: 1, filter: 'brightness(1) contrast(100%) blur(0px)' },
                    exit: { opacity: 0, filter: 'brightness(0) contrast(150%) blur(10px)' }
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 }
                };
        }
    };

    return (
        <motion.div
            className="w-full h-full relative"
            variants={getVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            {/* Very quick cinematic flash overlay to heighten transition impact */}
            {type === 'cinematic' && (
                <motion.div 
                    className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-overlay"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            )}
            {children}
        </motion.div>
    );
}
