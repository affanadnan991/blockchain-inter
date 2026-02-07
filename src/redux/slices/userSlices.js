import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  donations: [],
  totalDonated: 0,
  favoriteNGOs: [],
  taxReceipts: [],
  isLoading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addDonation: (state, action) => {
      state.donations.unshift(action.payload)
      state.totalDonated += action.payload.amount
    },
    updateDonations: (state, action) => {
      state.donations = action.payload
      state.totalDonated = action.payload.reduce((sum, donation) => sum + donation.amount, 0)
    },
    addFavoriteNGO: (state, action) => {
      if (!state.favoriteNGOs.includes(action.payload)) {
        state.favoriteNGOs.push(action.payload)
      }
    },
    removeFavoriteNGO: (state, action) => {
      state.favoriteNGOs = state.favoriteNGOs.filter(ngo => ngo !== action.payload)
    },
  },
})

export const {
  addDonation,
  updateDonations,
  addFavoriteNGO,
  removeFavoriteNGO,
} = userSlice.actions

export default userSlice.reducer