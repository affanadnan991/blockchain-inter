import React from 'react'
import Link from 'next/link'
import Image from "next/image"
import { FaArrowRight, FaShieldAlt, FaChartLine, FaHandsHelping, FaCheckCircle } from 'react-icons/fa'

// Reliable remote image for the hero section
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'

const Hero = () => {
    const features = [
        {
            icon: <FaShieldAlt />,
            title: "100% Secure",
            description: "Blockchain verified"
        },
        {
            icon: <FaChartLine />,
            title: "Full Transparency",
            description: "Track every donation"
        },
        {
            icon: <FaHandsHelping />,
            title: "Direct Impact",
            description: "Maximum to beneficiaries"
        }
    ]

    return (
        <section className="relative overflow-hidden bg-white py-12 lg:py-20 -mt-6 lg:-mt-8">
            {/* Background Elements - improved for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-70" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-green-600/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-emerald-600/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left Content */}
                        <div className="space-y-10">
                            <div className="space-y-8">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-100 shadow-sm rounded-full text-sm font-medium text-green-800 animate-fade-in">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Blockchain-Verified Transparency
                                </div>

                                {/* Heading */}
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                                    Donate with <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                        Complete Confidence
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                                    <span className="font-semibold text-gray-900">Every penny tracked.</span> Blockchain-verified transparency means you <span className="font-semibold text-gray-900">know exactly</span> where your donation goes and <span className="font-semibold text-gray-900">who it helps.</span> No more wondering. No more doubts.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/donate" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                        Start Donating Now
                                        <FaArrowRight />
                                    </button>
                                </Link>
                                <Link href="/ngos" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl text-lg font-bold transition-all flex items-center justify-center">
                                        Discover NGOs
                                    </button>
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="pt-10 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted By Communities Worldwide</p>
                                <div className="flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="flex items-center gap-2">
                                        <FaShieldAlt className="text-2xl" />
                                        <span className="font-bold text-lg">GiveHope Protocol</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-2xl" />
                                        <span className="font-bold text-lg">CertiK</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual - Interactive Card */}
                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            {/* Abstract Blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-green-100/50 to-blue-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

                            <div className="relative bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-2xl w-full max-w-md transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <FaChartLine className="text-green-600 text-xl" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Impact Realized</div>
                                            <div className="text-lg font-bold text-gray-900">+125%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-inner">
                                    <Image
                                        src={HERO_IMAGE_URL}
                                        alt="Impact"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-md text-xs font-bold">LATEST CAMPAIGN</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Clean Water Project</h3>
                                        <div className="w-full bg-white/30 h-1.5 rounded-full mb-2">
                                            <div className="bg-green-400 h-full rounded-full w-[75%]" />
                                        </div>
                                        <div className="flex justify-between text-sm opacity-90">
                                            <span>Collected: $15,000</span>
                                            <span>Goal: $20,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
