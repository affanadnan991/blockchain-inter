import React, { useState } from 'react';
import { FaPaperPlane, FaInfoCircle, FaCoins } from 'react-icons/fa';
import { useWeb3 } from '../../hooks/useWeb3';
import { getSupportedTokens } from '../../utils/tokenConfig';
export default function WithdrawalForm({ onSubmit, loading, balances = {}, isNGO = true }) {
    const { chainId } = useWeb3();

    const tokens = getSupportedTokens(chainId);

    const [formData, setFormData] = useState({
        tokenKey: tokens[0]?.symbol || 'MATIC',
        amount: '',
        purpose: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.purpose) return;
        onSubmit(formData.tokenKey, formData.amount, formData.purpose);
    };
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <FaPaperPlane size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Create Withdrawal Request</h2>
            </div>
            {isNGO ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Token Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Select Token</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                        {tokens.map((token) => (
                            <button
                                key={token.symbol}  
                                type="button"
                                onClick={() => setFormData({ ...formData, tokenKey: token.symbol })}
                                className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-lg border transition-all \n${formData.tokenKey === token.symbol
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                <img src={token.logo} alt={token.symbol} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                                {/* symbol visible on small screens, hidden on lg+ */}
                                <span className="block lg:hidden font-medium text-xs sm:text-sm truncate max-w-full">{token.symbol}</span>
                                {/* on larger screens show name on hover via abbr title */}
                                <abbr title={token.symbol} className="hidden lg:block text-transparent">?</abbr>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Amount Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-white/60">Amount</label>
                        <span className="text-xs text-white/40">
                            Available: {balances[formData.tokenKey]?.formatted || '0.00'} {formData.tokenKey}
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            step="any"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-12 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <FaCoins className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, amount: balances[formData.tokenKey]?.formatted || '0' })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-primary-light uppercase"
                        >
                            Max
                        </button>
                    </div>
                </div>
                {/* Purpose Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Withdrawal Purpose</label>
                    <textarea
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Explain how these funds will be used (this will be logged on-chain)..."
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                </div>
                {/* Notice */}
                <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200/80 text-sm">
                    <FaInfoCircle className="flex-shrink-0 mt-0.5" />
                    <p>
                        Only verified NGO members can submit this form. Your withdrawal request will be sent to the assigned NGO approvers; once enough approvals are granted, you can execute the withdrawal. Donors and external users cannot create or manipulate these requests.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading || !formData.amount || !formData.purpose}
                    className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    {loading ? 'Processing...' : 'Submit Withdrawal Request'}
                </button>
            </form>
            ) : (
                <div className="text-center text-red-400 py-8">
                    Only registered NGOs can create withdrawal requests. Your account does not have permission.
                </div>
            )}
        </div>
    );
}
