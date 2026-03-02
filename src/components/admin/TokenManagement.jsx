'use client'

import { useState, useMemo } from 'react'
import { FaCoins, FaPlus, FaMinusCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useAdmin } from '@/hooks/useAdmin'
import Button from '@/components/ui/Button'
import useIsOwner from '../../hooks/useIsOwner'
import { useWeb3 } from '../../hooks/useWeb3'
import { getSupportedTokens, formatTokenAmount } from '../../utils/tokenConfig' 

export default function TokenManagement() {
    const { whitelistToken, setTokenMinDonation, isLoading, setFeeOnTransferBlacklist } = useAdmin()
    const { chainId } = useWeb3()
    const tokens = useMemo(() => getSupportedTokens(chainId), [chainId])

    const [newToken, setNewToken] = useState({
        address: '',
        minAmount: '1'
    })

    const { isOwner, isLoading: ownerLoading } = useIsOwner()

    if (ownerLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>
    if (!isOwner) return (
        <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-center max-w-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
                <p className="text-gray-500">Only the contract owner may manage tokens.</p>
            </div>
        </div>
    )

    const handleWhitelist = async (e) => {
        e.preventDefault()
        try {
            await whitelistToken(newToken.address, true)
            await setTokenMinDonation(newToken.address, newToken.minAmount)
            setNewToken({ address: '', minAmount: '10' })
        } catch (err) { }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Token Whitelist</h2>
                    <p className="text-gray-500">Manage supported ERC20 tokens and donation limits.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Whitelist New Token */}
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaPlus className="text-green-500" /> Whitelist Token
                    </h3>
                    <form onSubmit={handleWhitelist} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Token Address</label>
                            <input
                                required
                                value={newToken.address}
                                onChange={e => setNewToken({ ...newToken, address: e.target.value })}
                                placeholder="0x..."
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Min Donation Amount</label>
                            <input
                                type="number"
                                required
                                value={newToken.minAmount}
                                onChange={e => setNewToken({ ...newToken, minAmount: e.target.value })}
                                placeholder="10"
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            Complete Whitelist
                        </Button>
                    </form>
                </div>

                {/* Tokens List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 px-2 flex items-center gap-2">
                        <FaCoins className="text-amber-500" /> Active Ecosystem Tokens
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {tokens.map((token) => (
                            <div
                                key={token.symbol}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-amber-200 transition-all space-y-4 md:space-y-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                                        {token.symbol === 'MATIC' ? '💜' : '💰'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{token.name}</div>
                                        <div className="text-xs font-mono text-gray-400">{token.symbol}</div>
                                        <div className="text-xs text-gray-500">Min: {formatTokenAmount(token.minDonation, token.decimals, 2)}</div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                        <FaCheckCircle /> ACTIVE
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                                            onClick={() => whitelistToken(token.address, false)}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            className="text-xs text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                                            onClick={async () => {
                                                const input = prompt('Enter new minimum donation amount in human units (e.g. 5)')
                                                if (input) {
                                                    try {
                                                        await setTokenMinDonation(token.address, input, token.decimals)
                                                        alert('Min donation updated')
                                                    } catch (e) {}
                                                }
                                            }}
                                        >
                                            Edit Min
                                        </button>
                                        <button
                                            className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                                            onClick={() => setFeeOnTransferBlacklist(token.address, true)}
                                        >
                                            Block FOT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
                        <FaExclamationCircle className="text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-900 text-sm">Security Note</h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Whitelisting a token allows it to be used for donations platform-wide. Ensure the token contract is verified and has standard ERC20 behavior.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
