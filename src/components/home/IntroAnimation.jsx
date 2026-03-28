'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
    const [isPlantGrowing, setIsPlantGrowing] = useState(false);

    // Generate an array of coin drops
    // Memoize so they don't regenerate on re-renders
    const [coins] = useState(() =>
        Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: 10 + Math.random() * 80, // random start horizontal position (vw) between 10 and 90
            delay: Math.random() * 1.5, // staggered drop
            duration: 0.8 + Math.random() * 0.7,
            size: 25 + Math.random() * 25
        }))
    );

    useEffect(() => {
        // Trigger plant growth after most coins have started falling
        const timer1 = setTimeout(() => {
            setIsPlantGrowing(true);
        }, 1200);

        // End the whole animation and call onComplete
        const timer2 = setTimeout(() => {
            onComplete();
        }, 3800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-slate-900"
        >
            {/* Deep rich background gradient for premium feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/40 via-slate-900 to-black opacity-90" />

            {/* Falling Coins */}
            {coins.map((coin) => (
                <motion.div
                    key={coin.id}
                    initial={{ y: '-15vh', x: `${coin.x}vw`, opacity: 0, rotate: 0 }}
                    animate={{
                        y: '65vh',
                        opacity: [0, 1, 1, 0],
                        rotate: 720
                    }}
                    transition={{
                        delay: coin.delay,
                        duration: coin.duration,
                        ease: "easeIn"
                    }}
                    className="absolute top-0 z-10 drop-shadow-2xl"
                    style={{ left: 0 }}
                >
                    {/* Premium Golden Coin SVG */}
                    <svg width={coin.size} height={coin.size} viewBox="0 0 100 100" className="drop-shadow-xl">
                        <defs>
                            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FDE047" />
                                <stop offset="50%" stopColor="#EAB308" />
                                <stop offset="100%" stopColor="#A16207" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#gold-grad)" stroke="#CA8A04" strokeWidth="3" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#FEF08A" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                        <circle cx="50" cy="50" r="28" fill="#EAB308" />
                        <text x="50" y="65" fontSize="42" fontWeight="900" fontFamily="sans-serif" fill="#FFF" textAnchor="middle" style={{ textShadow: "0px 2px 4px rgba(161,98,7,0.8)" }}>$</text>
                    </svg>
                </motion.div>
            ))}

            {/* Glowing / Growing Plant */}
            <motion.div
                className="relative z-20 mt-32 flex flex-col items-center justify-end h-64"
            >
                {/* Glow effect behind plant */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: isPlantGrowing ? 0.6 : 0,
                        scale: isPlantGrowing ? 1.5 : 0.5
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute bottom-10 w-64 h-64 bg-green-500 rounded-full blur-[80px]"
                />

                {/* The Plant */}
                <motion.svg
                    width="160"
                    height="200"
                    viewBox="0 0 100 150"
                    className="relative z-10 overflow-visible drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPlantGrowing ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <defs>
                        <linearGradient id="stem-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#064E3B" />
                            <stop offset="50%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>
                        <linearGradient id="leaf-1-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#6EE7B7" />
                        </linearGradient>
                        <linearGradient id="leaf-2-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#047857" />
                            <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>
                        <linearGradient id="leaf-3-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#A7F3D0" />
                        </linearGradient>
                    </defs>

                    {/* Stem */}
                    <motion.path
                        d="M 50 145 C 55 110, 42 75, 48 35"
                        stroke="url(#stem-grad)"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isPlantGrowing ? 1 : 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />

                    {/* Left Leaf Base */}
                    <motion.path
                        d="M 52 95 C 22 90, 7 65, 12 40 C 32 50, 47 70, 52 95 Z"
                        fill="url(#leaf-1-grad)"
                        initial={{ scale: 0 }}
                        animate={{ scale: isPlantGrowing ? 1 : 0 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
                        style={{ transformOrigin: "52px 95px" }}
                    />
                    
                    {/* Left Leaf Vein */}
                    <motion.path
                        d="M 52 95 C 35 80, 20 60, 15 45"
                        stroke="#022C22"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: isPlantGrowing ? 1 : 0, opacity: isPlantGrowing ? 0.3 : 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    />

                    {/* Right Leaf Base */}
                    <motion.path
                        d="M 45 65 C 75 60, 95 40, 90 15 C 70 25, 55 45, 45 65 Z"
                        fill="url(#leaf-2-grad)"
                        initial={{ scale: 0 }}
                        animate={{ scale: isPlantGrowing ? 1 : 0 }}
                        transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.4 }}
                        style={{ transformOrigin: "45px 65px" }}
                    />

                    {/* Right Leaf Vein */}
                    <motion.path
                        d="M 45 65 C 65 50, 80 30, 85 20"
                        stroke="#022C22"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: isPlantGrowing ? 1 : 0, opacity: isPlantGrowing ? 0.3 : 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                    />

                    {/* Top Leaf Base */}
                    <motion.path
                        d="M 48 35 C 35 25, 30 5, 45 0 C 60 5, 55 25, 48 35 Z"
                        fill="url(#leaf-3-grad)"
                        initial={{ scale: 0 }}
                        animate={{ scale: isPlantGrowing ? 1 : 0 }}
                        transition={{ delay: 0.9, duration: 0.8, type: "spring", bounce: 0.4 }}
                        style={{ transformOrigin: "48px 35px" }}
                    />

                    {/* Top Leaf Vein */}
                    <motion.path
                        d="M 48 35 C 45 20, 46 10, 46 5"
                        stroke="#047857"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: isPlantGrowing ? 1 : 0, opacity: isPlantGrowing ? 0.4 : 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    />
                </motion.svg>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isPlantGrowing ? 1 : 0, y: isPlantGrowing ? 0 : 20 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mt-8 text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-yellow-200 tracking-wide drop-shadow-sm"
                >
                    Hope is Growing
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPlantGrowing ? 0.8 : 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mt-2 text-sm md:text-base text-gray-300 max-w-xs text-center font-medium"
                >
                    Every drop creates an ocean of impact.
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default IntroAnimation;
