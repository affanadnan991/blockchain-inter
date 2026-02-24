'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FaWallet } from 'react-icons/fa'

/**
 * Custom Wallet Connect Button
 * Uses RainbowKit's ConnectButton with custom styling
 */
export default function WalletConnect() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading'
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated')

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="btn-primary flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                                    >
                                        <FaWallet className="w-5 h-5" />
                                        Connect Wallet
                                    </button>
                                )
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="btn-danger flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200"
                                    >
                                        Wrong Network
                                    </button>
                                )
                            }

                            return (
                                <div className="flex gap-3">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="btn-secondary flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 20, height: 20 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="btn-account flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary-dark/10 border-2 border-primary text-gray-900 dark:text-green-600 font-medium rounded-lg hover:from-primary/20 hover:to-primary-dark/20 transition-all duration-200"
                                    >
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
