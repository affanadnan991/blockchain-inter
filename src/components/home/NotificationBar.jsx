'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaMoon, FaStar, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

const NotificationBar = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    // Ramadan 2026 starts around February 28, 2026 (approximate)
    const ramadanStartDate = new Date('2026-02-28T00:00:00')

    useEffect(() => {
        // Check if user has dismissed the notification
        const dismissed = localStorage.getItem('ramadan-notification-dismissed')
        if (dismissed) {
            setIsVisible(false)
            return
        }

        // Countdown timer
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = ramadanStartDate.getTime() - now

            if (distance < 0) {
                clearInterval(timer)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('ramadan-notification-dismissed', 'true')
    }

    if (!isVisible) return null

    return (
        <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                    animation: 'float 15s ease-in-out infinite'
                }} />
            </div>

            {/* Decorative Stars */}
            <div className="absolute inset-0 overflow-hidden">
                <FaStar className="absolute top-2 left-[10%] text-yellow-300 opacity-60 animate-pulse" style={{ animationDelay: '0s' }} />
                <FaMoon className="absolute top-3 left-[30%] text-yellow-200 opacity-40 text-xl" />
                <FaStar className="absolute top-2 right-[15%] text-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
                <FaStar className="absolute top-4 right-[35%] text-yellow-400 opacity-30 text-xs animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative container mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Message */}
                    <div className="flex items-center gap-3 text-center md:text-left">
                        <div className="hidden md:flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full">
                            <FaMoon className="text-yellow-300 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg md:text-xl flex items-center gap-2 justify-center md:justify-start">
                                <FaMoon className="md:hidden text-yellow-300" />
                                Ramadan Charity Campaign 🌙
                            </h3>
                            <p className="text-sm text-white/90">
                                Double your blessings - Support those in need this holy month
                            </p>
                        </div>
                    </div>

                    {/* Center: Countdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold opacity-90 hidden sm:block">Starts in:</span>
                        <div className="flex gap-2">
                            {[
                                { value: timeLeft.days, label: 'Days' },
                                { value: timeLeft.hours, label: 'Hrs' },
                                { value: timeLeft.minutes, label: 'Min' },
                                { value: timeLeft.seconds, label: 'Sec' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[50px] text-center">
                                    <div className="text-lg md:text-xl font-bold leading-none">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] opacity-80 uppercase tracking-wider">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex items-center gap-3">
                        <Link href="/donate">
                            <button className="bg-white text-green-700 hover:bg-green-50 px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
                                Donate Now
                                <FaArrowRight className="text-xs" />
                            </button>
                        </Link>

                        {/* Dismiss Button */}
                        <button
                            onClick={handleDismiss}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Dismiss notification"
                        >
                            <FaTimes className="text-white/80 hover:text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    )
}

export default NotificationBar
