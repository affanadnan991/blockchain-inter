'use client'
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaTint, FaGraduationCap, FaUtensils, FaHome, FaSeedling } from 'react-icons/fa';

const ImpactSlider = ({ amount, targetAmountBase = 'MATIC' }) => {
    // Determine numerical amount, fallback to 0
    const val = parseFloat(amount) || 0;

    // Calculate tangible impacts based on arbitrary but realistic-sounding conversion rates
    // Assuming 1 MATIC ~$0.50 (for display logic only, no real fiat conversion needed)
    const impact = useMemo(() => {
        if (val < 5) return { 
            text: "Every contribution sparks hope.", 
            icon: <FaSeedling className="text-green-500 w-8 h-8" />, 
            color: "from-green-400 to-green-600" 
        };
        if (val < 20) return { 
            text: `Provides ${Math.floor(val * 2)} nutritious meals`, 
            icon: <FaUtensils className="text-orange-500 w-8 h-8" />, 
            color: "from-orange-400 to-red-500" 
        };
        if (val < 50) return { 
            text: `Supplies clean water for a family for ${Math.floor(val / 5)} weeks`, 
            icon: <FaTint className="text-blue-500 w-8 h-8" />, 
            color: "from-blue-400 to-cyan-500" 
        };
        if (val < 100) return { 
            text: `Funds education supplies for ${Math.floor(val / 15)} children`, 
            icon: <FaGraduationCap className="text-purple-500 w-8 h-8" />, 
            color: "from-purple-400 to-indigo-500" 
        };
        return { 
            text: `Secures emergency shelter for ${Math.floor(val / 50)} families`, 
            icon: <FaHome className="text-teal-500 w-8 h-8" />, 
            color: "from-teal-400 to-emerald-600" 
        };
    }, [val]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-2 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden relative"
        >
            {/* Background dynamic glow based on amount tier */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${impact.color} opacity-10 blur-2xl transition-all duration-500`} />
            
            <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                    key={impact.text} // Re-animate icon when text changes
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex-shrink-0 bg-white dark:bg-slate-700 p-3 rounded-full shadow-md"
                >
                    {impact.icon}
                </motion.div>
                
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Tangible Impact
                    </p>
                    <motion.p 
                        key={impact.text + "desc"} 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200"
                    >
                        {val > 0 ? impact.text : "Enter an amount to see your impact"}
                    </motion.p>
                </div>
            </div>
            
            {/* Minimal Progress Bar to signify "Leveling Up" the impact */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                <motion.div 
                    className={`h-full bg-gradient-to-r ${impact.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((val / 100) * 100, 100)}%` }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                />
            </div>
        </motion.div>
    );
};

export default ImpactSlider;
