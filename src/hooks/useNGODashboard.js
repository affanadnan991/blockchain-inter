import { useAccount, useContractRead, useConfig, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { readContract } from '@wagmi/core';
import { useState, useEffect, useMemo } from 'react';
import { getContractAddress, getSupportedTokens } from '../utils/web3Config';
import DonationPlatformABI from '../contracts/abis/DonationPlatform.json';
import { toast } from 'react-hot-toast';
import { parseUnits, formatUnits, keccak256, stringToHex } from 'viem';

export function useNGODashboard() {
    const { address, isConnected } = useAccount();
    const config = useConfig();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

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
    const createRequest = async (tokenSymbol, amount, purpose, donationIds = [], withdrawalAmounts = []) => {
        if (!walletClient || !contractAddress) {
            throw new Error('Wallet not connected or contract address missing');
        }

        setLoading(true);
        try {
            const token = supportedTokens.find(t => t.symbol === tokenSymbol);
            const amountWei = parseUnits(amount.toString(), token.decimals);

            // Fixed Bug 6: In a real app, we'd hash the purpose string or use a proper mechanism
            const purposeHash = purpose ? keccak256(stringToHex(purpose)) : '0x0000000000000000000000000000000000000000000000000000000000000000';

            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'createWithdrawalRequest',
                args: [
                    0n, // Fixed Bug 6: dummy ID overwritten by contract
                    token.address,
                    amountWei,
                    purposeHash,
                    donationIds,
                    withdrawalAmounts
                ]
            });

            const hash = await walletClient.writeContract(request);

            toast.success('Withdrawal request tx submitted! Pending confirmation.');
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success('Withdrawal request created!');
            return hash;
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error(error.message || 'Failed to create request');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 6. Execute Withdrawal
    const executeRequest = async (requestId) => {
        if (!walletClient || !contractAddress) {
            throw new Error('Wallet not connected or contract address missing');
        }

        setLoading(true);
        try {
            const { request } = await publicClient.simulateContract({
                account: address,
                address: contractAddress,
                abi: DonationPlatformABI,
                functionName: 'executeWithdrawal',
                args: [BigInt(requestId)]
            });

            const hash = await walletClient.writeContract(request);

            toast.success('Withdrawal tx submitted! Pending confirmation.');
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success('Withdrawal executed successfully! 🎉');
            return hash;
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
