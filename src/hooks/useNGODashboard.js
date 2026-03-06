import { useAccount, useContractRead, useContractWrite, useConfig, useChainId } from 'wagmi';
import { readContract } from '@wagmi/core';
import { useState, useEffect, useMemo } from 'react';
import { getContractAddress } from '../utils/web3Config';
import { getSupportedTokens } from '../utils/tokenConfig';
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json';
import { toast } from 'react-hot-toast';
import { parseUnits, formatUnits } from 'viem';
import { ethers } from 'ethers';

export function useNGODashboard() {
    const { address, isConnected } = useAccount();
    const config = useConfig();
    const chainId = useChainId();

    const contractAddress = useMemo(() => getContractAddress(chainId), [chainId]);
    const supportedTokens = useMemo(() => getSupportedTokens(chainId), [chainId]);

    const [stats, setStats] = useState(null);
    const [balances, setBalances] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Check if registered NGO
    const { data: isNGO } = useContractRead({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'isRegisteredNGO',
        args: [address],
        enabled: isConnected && !!address && !!contractAddress,
    });

    // 2. Get NGO Info (Stats)
    const fetchNGOInfo = async () => {
        if (!address) return;
        try {
            const data = await readContract(config, {
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getNGOInfo',
                args: [address],
            });

            setStats({
                totalWithdrawn: data[1],
                lastWithdrawal: Number(data[2]),
                withdrawalCount: data[3],
                pendingRequestsCount: data[4],
                isActive: data[5],
                withdrawalsPaused: data[6],
                minApprovals: data[7],
                approversCount: data[8],
            });
        } catch (error) {
            console.error('Error fetching NGO info:', error);
        }
    };

    // 3. Get Balances for all tokens
    const fetchBalances = async () => {
        if (!address) return;
        const newBalances = {};
        try {
            for (const token of supportedTokens) {
                const balance = await readContract(config, {
                    address: contractAddress,
                    abi: DonationPlatformABI,
                    functionName: 'getNGOBalance',
                    args: [address, token.address],
                });
                newBalances[token.symbol] = {
                    ...token,
                    amount: balance,
                    formatted: formatUnits(balance, token.decimals)
                };
            }
            setBalances(newBalances);
        } catch (error) {
            console.error('Error fetching NGO balances:', error);
        }
    };

    // 4. Get Withdrawal Requests
    const fetchRequests = async () => {
        if (!address) return;
        try {
            const requestIds = await readContract(config, {
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'getPendingRequests',
                args: [address],
            });

            const requestDetails = await Promise.all(
                requestIds.map(async (id) => {
                    const detail = await readContract(config, {
                        address: contractAddress,
                        abi: DonationPlatformABI,
                        functionName: 'withdrawalRequests',
                        args: [id],
                    });
                    return {
                        id: id.toString(),
                        ngo: detail[0],
                        token: detail[1],
                        amount: detail[2],
                        timestamp: Number(detail[3]),
                        executed: detail[4],
                        approvalsNeeded: detail[5],
                        approvalCount: detail[6],
                        purposeHash: detail[7],
                    };
                })
            );
            setRequests(requestDetails);
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
        }
    };

    // 5. Create Withdrawal Request
    const { writeAsync: createRequestContract } = useContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'createWithdrawalRequest',
    });

    const createRequest = async (tokenSymbol, amount, purpose) => {
        setLoading(true);
        try {
            const token = supportedTokens.find(t => t.symbol === tokenSymbol);
            if (!token) {
                throw new Error('Token not found');
            }
            
            const amountWei = parseUnits(amount.toString(), token.decimals);

            // Hash the purpose string
            const purposeHash = ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes(purpose)
            );

            // For a simple withdrawal without specific donation tracking, use empty arrays
            // In production, you'd need to track specific donation IDs
            const donationIds = [];
            const withdrawalAmounts = [];

            const tx = await createRequestContract({
                args: [
                    token.address,           // token address
                    amountWei,              // amount in Wei
                    purposeHash,            // hash of purpose
                    purpose,                // raw purpose string for verification
                    donationIds,            // donation IDs (empty for simple withdrawals)
                    withdrawalAmounts       // withdrawal amounts per donation (empty for simple withdrawals)
                ]
            });
            
            await tx.wait();
            await fetchRequests(); // Refresh the requests list
            toast.success('Withdrawal request created! Pending approval.');
            return tx;
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error(error.message || 'Failed to create request');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 6. Execute Withdrawal
    const { writeAsync: executeWithdrawalContract } = useContractWrite({
        address: contractAddress,
        abi: DonationPlatformABI,
        functionName: 'executeWithdrawal',
    });

    const executeRequest = async (requestId) => {
        setLoading(true);
        try {
            const tx = await executeWithdrawalContract({
                args: [requestId]
            });
            toast.success('Withdrawal executed successfully! 🎉');
            return tx;
        } catch (error) {
            console.error('Error executing withdrawal:', error);
            toast.error(error.message || 'Failed to execute withdrawal');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && isNGO) {
            fetchNGOInfo();
            fetchBalances();
            fetchRequests();
        }
    }, [isConnected, isNGO, address]);

    return {
        isNGO,
        stats,
        balances,
        requests,
        loading,
        refresh: () => {
            fetchNGOInfo();
            fetchBalances();
            fetchRequests();
        },
        createRequest,
        executeRequest,
    };
}
