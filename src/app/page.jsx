'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import IntroAnimation from '../components/home/IntroAnimation'
import DonationTicker from '../components/home/DonationTicker'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import FeaturedNGOs from '../components/home/FeaturedNGOs'
import RecentDonations from '../components/home/RecentDonations'
import HowItWorks from '../components/home/HowItWorks'
// import NotificationBar from '../components/home/NotificationBar'
import Features from '../components/home/Features'

export default function Home() {
    const [showIntro, setShowIntro] = useState(true);

    const handleIntroComplete = () => {
        setShowIntro(false);
    };

    return (
        <>
            <AnimatePresence>
                {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
            </AnimatePresence>

            <div className={`flex flex-col min-h-screen pt-0 ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
                {/* <NotificationBar /> */}
                <DonationTicker />
                <main className="pt-0">
                    <Hero />

                    {/* Statistics Section - Transparency & Impact Metrics */}
                    <section className="bg-white py-20 md:py-28">
                        <div className="container mx-auto px-4">
                            <div className="max-w-7xl mx-auto">
                                <Stats />
                            </div>
                        </div>
                    </section>

                    {/* Spacing Divider */}
                    <div className="h-16 md:h-20 bg-gradient-to-b from-white to-gray-50" />

                    {/* Features Section */}
                    <Features />

                    {/* Spacing Divider */}
                    <div className="h-16 md:h-20 bg-gradient-to-b from-gray-50 to-white" />

                    {/* Featured NGOs Section */}
                    <FeaturedNGOs />

                    {/* Spacing Divider */}
                    <div className="h-16 md:h-20 bg-gradient-to-t from-white to-gray-50" />

                    {/* How It Works Section */}
                    <HowItWorks />

                    {/* Spacing Divider */}
                    <div className="h-16 md:h-20 bg-gradient-to-b from-gray-50 to-white" />

                    {/* Recent Donations Section */}
                    <RecentDonations />

                    {/* Spacing Divider */}
                    <div className="h-8 md:h-12" />

                    {/* Improved CTA Section */}
                    <section className="py-28 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                        <div className="container mx-auto px-4 text-center relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">
                                Ready to Make an Impact?
                            </h2>
                            <p className="text-green-50 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of donors who trust GiveHope for 100% transparent giving. Your contribution creates real, blockchain-verified change.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    href="/donate"
                                    className="px-10 py-5 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-1 transform"
                                >
                                    Start Donating Now
                                </Link>
                                <Link
                                    href="/ngos"
                                    className="px-10 py-5 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-all border border-green-500/30 hover:-translate-y-1 transform"
                                >
                                    Explore NGOs
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}
