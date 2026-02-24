'use client'

import { useState } from 'react'
import { FaPercent, FaWallet, FaShieldAlt, FaBriefcase, FaUserShield } from 'react-icons/fa'
import { useAdmin } from '../../hooks/useAdmin'
import Button from '../../components/ui/Button'
import { useNGOData } from '../../hooks/useNGOData'
import useIsOwner from '../../hooks/useIsOwner'

export default function SystemSettings() {
    const { updatePlatformFee, updateFeeCollector, unpause, pause, isLoading } = useAdmin()
    const { stats, refresh } = useNGOData()
    const { isOwner, isLoading: ownerLoading } = useIsOwner()

    if (ownerLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>
    if (!isOwner) return (
        <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-center max-w-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
                <p className="text-gray-500">Only the contract owner may access system settings.</p>
            </div>
        </div>
    )

    const [fee, setFee] = useState('2')
    const [collector, setCollector] = useState('')

    const handleUpdateFee = async (e) => {
        e.preventDefault()
        try {
            await updatePlatformFee(parseInt(fee))
            refresh()
        } catch (err) { }
    }

    const handleUpdateCollector = async (e) => {
        e.preventDefault()
        try {
            await updateFeeCollector(collector)
            setCollector('')
            refresh()
        } catch (err) { }
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Platform Settings */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaPercent className="text-blue-500" /> Platform Fee
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Configure the percentage taken per donation.</p>
                </div>

                <form onSubmit={handleUpdateFee} className="space-y-4">
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="20"
                            value={fee}
                            onChange={e => setFee(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                    </div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Update Fee Structure
                    </Button>
                </form>

                <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaWallet className="text-purple-500" /> Fee Collector
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Set the specific wallet address that receives the platform fees.</p>
                </div>

                <form onSubmit={handleUpdateCollector} className="space-y-4">
                    <input
                        value={collector}
                        onChange={e => setCollector(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Change Collector
                    </Button>
                </form>
            </div>

            {/* Emergency Controls */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 h-fit">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 text-red-600">
                        <FaShieldAlt /> Protocol Security
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Critical emergency controls for the entire platform.</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                        <h4 className="font-bold text-red-900 text-sm mb-1 uppercase tracking-wider">Circuit Breaker</h4>
                        <p className="text-xs text-red-700 mb-4">Pausing the platform will stop all donations and withdrawals immediately.</p>

                        <div className="flex gap-3">
                            <Button
                                onClick={pause}
                                isLoading={isLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Emergency Pause
                            </Button>
                            <Button
                                onClick={unpause}
                                isLoading={isLoading}
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            >
                                Resume Protocol
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <h4 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-wider">Governance Roles</h4>
                        <p className="text-xs text-amber-700 mb-4">Manage protocol-level administrators and withdrawal approvers.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button size="sm" variant="outline" className="border-amber-200 text-amber-700">
                                <FaUserShield className="mr-2" /> Add Manager
                            </Button>
                            <Button size="sm" variant="outline" className="border-amber-200 text-amber-700">
                                <FaBriefcase className="mr-2" /> Audit Logs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
