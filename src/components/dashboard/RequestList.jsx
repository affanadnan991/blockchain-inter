import React from 'react';
import { FaCheck, FaExternalLinkAlt, FaClock, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { formatTokenAmount, shortenAddress } from '../../utils/formatters';
import { SUPPORTED_TOKENS, getExplorerUrl } from '../../utils/web3Config';
export default function RequestList({ requests = [], onExecute, loading }) {
    const getStatusBadge = (request) => {
        if (request.executed) {
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    <FaCheck size={10} /> Executed
                </span>
            );
        }
        if (request.approvalCount >= request.approvalsNeeded) {
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                    Ready to Execute
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider">
                <FaClock size={10} /> Pending Approvals
            </span>
        );
    };
    const getTokenSymbol = (tokenAddress) => {
        const token = Object.values(SUPPORTED_TOKENS).find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
        return token ? token.symbol : 'UNKNOWN';
    };
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Withdrawal History & Requests</h2>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span className="text-white/40">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-white/40">Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-white/40">Success</span>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-xs font-bold text-white/40 uppercase tracking-widest">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Approvals</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-white/20 italic">
                                    No withdrawal requests found
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-white/60">#{req.id.slice(-4)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">
                                                {formatTokenAmount(req.amount, 18)} {getTokenSymbol(req.token)}
                                            </span>
                                            <span className="text-xs text-white/40">NGO Funds</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5">
                                            {getStatusBadge(req)}
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(req.approvalCount / req.approvalsNeeded) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[10px] text-white/40 font-medium">
                                                {req.approvalCount} / {req.approvalsNeeded} approvals
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-white/60">
                                            {new Date(req.timestamp * 1000).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!req.executed && req.approvalCount >= req.approvalsNeeded ? (
                                            <button
                                                disabled={loading}
                                                onClick={() => onExecute(req.id)}
                                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                {loading ? '...' : 'Execute'}
                                            </button>
                                        ) : (
                                            <button className="p-2 text-white/20 hover:text-white/60 transition-colors">
                                                <FaExternalLinkAlt size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
