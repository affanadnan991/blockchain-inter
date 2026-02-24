'use client'

import React from 'react'
import { FaWallet, FaSearch, FaHandHoldingUsd, FaChartBar, FaReceipt, FaLock, FaEye, FaUserShield } from 'react-icons/fa'

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <FaWallet className="text-2xl" />,
            title: "Connect Wallet",
            description: "Securely connect your MetaMask wallet with one click",
            problem: "No More Data Breaches",
            problemDesc: "Your wallet, your control. No storing sensitive payment info."
        },
        {
            number: "02",
            icon: <FaSearch className="text-2xl" />,
            title: "Choose Verified NGO",
            description: "Browse thoroughly vetted NGOs with blockchain-verified credentials",
            problem: "No More Fake Charities",
            problemDesc: "Every NGO is verified on-chain. Scams eliminated."
        },
        {
            number: "03",
            icon: <FaHandHoldingUsd className="text-2xl" />,
            title: "Donate with Clarity",
            description: "Choose amount and currency. See exactly where it goes before sending",
            problem: "No More Hidden Fees",
            problemDesc: "Transparent gas fees. No surprise deductions."
        },
        {
            number: "04",
            icon: <FaChartBar className="text-2xl" />,
            title: "Track in Real-Time",
            description: "Watch your donation's journey from wallet to beneficiary",
            problem: "No More Black Box",
            problemDesc: "Every transaction recorded permanently on blockchain."
        },
        {
            number: "05",
            icon: <FaReceipt className="text-2xl" />,
            title: "Get Proof",
            description: "Download blockchain-verified receipt for tax purposes",
            problem: "No More Doubts",
            problemDesc: "Cryptographic proof that can't be faked or altered."
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1.5 bg-green-50 border border-green-100 rounded-full text-green-700 text-sm font-bold mb-4">
                        Simple & Transparent Process
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Donate in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            5 Easy Steps
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        We solve the biggest problems in charity: <span className="text-gray-900 font-semibold">trust, transparency, and accountability.</span> Here's how it works.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute left-0 right-0 h-0.5 bg-gradient-to-r from-green-600/20 via-green-600/40 to-green-600/20" style={{ top: '60px' }} />

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center group">
                                {/* Step Number */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-green-600/10 rounded-full scale-110 group-hover:scale-125 transition-transform" />
                                    <div className="relative w-20 h-20 mx-auto bg-white border-2 border-green-600/20 rounded-full flex items-center justify-center group-hover:border-green-600/40 group-hover:shadow-lg transition-all duration-300">
                                        <div className="text-2xl font-bold text-green-600">
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300">
                                        <div className="text-green-600 group-hover:scale-110 transition-transform">
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-8 space-y-4">
                                    {/* Problem Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full mb-2">
                                        <FaLock className="text-rose-500 text-xs" />
                                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">{step.problem}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {step.description}
                                    </p>

                                    {/* Solution Highlight */}
                                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                                        <p className="text-xs font-semibold text-green-800 flex items-center justify-center gap-2">
                                            <FaEye className="text-green-600" />
                                            {step.problemDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-600/5 border border-green-600/20 rounded-full">
                        <FaUserShield className="text-green-600 text-xl" />
                        <p className="text-sm font-semibold text-gray-700">
                            <span className="text-green-600 font-bold">100% Transparent</span> · Every step verified on blockchain
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
