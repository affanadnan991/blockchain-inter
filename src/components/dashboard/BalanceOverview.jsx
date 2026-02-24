import React from 'react';
import { FaWallet, FaCoins, FaHistory, FaArrowUp } from 'react-icons/fa';
import { formatTokenAmount, formatUSD } from '../../utils/formatters';
export default function BalanceOverview({ balances = {}, stats = {} }) {
    const safeStats = stats || {};
    const tokenList = Object.entries(balances);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Stats */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                        <FaWallet size={24} />
                    </div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Total Withdrawn</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white">
                        {safeStats.totalWithdrawn ? formatTokenAmount(safeStats.totalWithdrawn, 18) : '0.00'}
                    </h3>
                    <p className="text-sm text-white/50">MATIC Equivalent</p>
                </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-secondary/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                        <FaHistory size={24} />
                    </div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Withdrawals</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white">{safeStats.withdrawalCount || '0'}</h3>
                    <p className="text-sm text-white/50">Executed Transfers</p>
                </div>
            </div>
            {/* Token Balances */}
            {tokenList.map(([key, token]) => (
                <div key={key} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                            {token.logo ? (
                                <img src={token.logo} alt={token.symbol} className="w-6 h-6 object-contain" />
                            ) : (
                                <FaCoins className="text-white/40" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{token.symbol}</h4>
                            <p className="text-xs text-white/40">{token.name}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white">
                            {token.formatted || '0.00'}
                        </h3>
                        <p className="text-xs text-white/50">Current Balance</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
