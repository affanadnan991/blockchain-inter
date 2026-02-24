'use client'

import React from 'react'
import { FaCheckCircle, FaDownload, FaShareAlt, FaHeart } from 'react-icons/fa'
import { shortenAddress } from '../../utils/formatters'

/**
 * Donation Receipt Component
 * Shows a beautiful summary of a successful donation
 */
export default function DonationReceipt({ donation, ngo, token }) {
    if (!donation) return null

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-w-lg mx-auto overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16" />

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <FaCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Impact Receipt</h2>
                <p className="text-gray-500 dark:text-gray-400">Thank you for your generous contribution</p>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount Donated</span>
                        <span className="text-2xl font-black text-green-600 dark:text-green-400">
                            {donation.amount} {token?.symbol || 'MATIC'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">To NGO</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{ngo?.name || 'General Pool'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Donor</span>
                        <span className="text-sm font-mono text-gray-900 dark:text-white">{shortenAddress(donation.donor)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(donation.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Impact Statement */}
                <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg shadow-green-200 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-3">
                        <FaHeart className="text-green-300" />
                        <h4 className="font-bold">Your Impact</h4>
                    </div>
                    <p className="text-sm text-green-50 leading-relaxed">
                        Your contribution helps sustain vital transparent charitable activities. 100% of these funds (after the minimal protocol fee) are directly accessible by {ngo?.name || 'verified NGOs'}.
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                        <FaDownload size={12} />
                        Download
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                        <FaShareAlt size={12} />
                        Share Impact
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Verified On Polygon Blockchain • Tx: {shortenAddress(donation.id, 8)}
                </p>
            </div>
        </div>
    )
}
