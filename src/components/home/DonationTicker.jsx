'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { FaWater, FaBookOpen, FaStethoscope } from 'react-icons/fa';

const MOCK_DONATIONS = [
    { id: 1, user: "Ahmed T.", amount: "50 MATIC", cause: "Clean Water Project", icon: <FaWater className="text-blue-500" /> },
    { id: 2, user: "Sarah J.", amount: "120 MATIC", cause: "Girls Education", icon: <FaBookOpen className="text-purple-500" /> },
    { id: 3, user: "Anonymous", amount: "500 USDC", cause: "Emergency Medical Relief", icon: <FaStethoscope className="text-red-500" /> },
    { id: 4, user: "Raza Ali", amount: "10 MATIC", cause: "Daily Meals Program", icon: <FaHeart className="text-pink-500" /> },
    { id: 5, user: "Fatima Noor", amount: "75 MATIC", cause: "Clean Water Project", icon: <FaWater className="text-blue-500" /> },
];

const DonationTicker = () => {
    // We duplicate the array to create a seamless infinite loop
    const duplicatedDonations = [...MOCK_DONATIONS, ...MOCK_DONATIONS, ...MOCK_DONATIONS];

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 py-2 overflow-hidden flex items-center relative z-50">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />

            <div className="flex whitespace-nowrap items-center">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{
                        x: ['0%', '-33.33%'], // Move exactly one original array length
                    }}
                    transition={{
                        ease: "linear",
                        duration: 20, // Adjust speed here
                        repeat: Infinity,
                    }}
                >
                    {duplicatedDonations.map((donation, index) => (
                        <div
                            key={`${donation.id}-${index}`}
                            className="flex items-center gap-3 text-slate-300 text-sm font-medium bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-default"
                        >
                            <span className="flex items-center justify-center bg-slate-800 rounded-full p-1.5">
                                {donation.icon}
                            </span>
                            <span className="text-white font-bold">{donation.user}</span>
                            <span className="text-slate-400">donated</span>
                            <span className="text-green-400 font-bold">{donation.amount}</span>
                            <span className="text-slate-400">to</span>
                            <span className="text-slate-200">{donation.cause}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        </div>
    );
};

export default DonationTicker;
