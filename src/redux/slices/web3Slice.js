import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,
  networkName: null,
  isLoading: false,
  error: null,
}

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    connectWalletStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    connectWalletSuccess: (state, action) => {
      state.isConnected = true
      state.address = action.payload.address
      state.chainId = action.payload.chainId
      state.balance = action.payload.balance
      state.networkName = action.payload.networkName
      state.isLoading = false
    },
    connectWalletFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    disconnectWallet: (state) => {
      return initialState
    },
    updateBalance: (state, action) => {
      state.balance = action.payload
    },
    updateNetwork: (state, action) => {
      state.chainId = action.payload.chainId
      state.networkName = action.payload.networkName
    },
  },
})

export const {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance,
  updateNetwork,
} = web3Slice.actions

export default web3Slice.reducer