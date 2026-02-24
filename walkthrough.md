# Phase 3 Walkthrough: NGO Dashboard 🏥

Phase 3 introduces a dedicated portal for registered NGO owners to manage their funds, track donations, and initiate withdrawal requests.

## 🚀 Key Features

### 1. Secure Access Control
The dashboard is locked behind two layers of security:
- **Wallet Connection**: Users must connect their wallet.
- **NGO Registration**: The system checks the `isRegisteredNGO` mapping on the smart contract. Only authorized addresses can view the dashboard.

### 2. Comprehensive Financial Overview
The [BalanceOverview](file:///home/affan/code/blockchain-inter/src/components/ngo/BalanceOverview.jsx#5-66) component provides a real-time view of:
- **Total Withdrawn**: Aggregate of all past successful withdrawals.
- **Token Balances**: Individual balances for MATIC, USDT, USDC, and DAI held within the donation contract for that specific NGO.

### 3. Integrated Withdrawal System
A seamless flow for NGOs to access their funds:
- **Request Creation**: Using [WithdrawalForm](file:///home/affan/code/blockchain-inter/src/components/ngo/WithdrawalForm.jsx#5-108), NGOs can specify the amount and purpose for withdrawal.
- **Approval Tracking**: [RequestList](file:///home/affan/code/blockchain-inter/src/components/ngo/RequestList.jsx#6-127) shows how many approvals are still needed from the assigned approvers.
- **On-chain Execution**: Once approvals are met, a "Execute" button appears to finalize the transfer.

## Phase 4: Data Integration (Complete) ✅

### Real-time Blockchain Discovery
- **[useNGOData.js](file:///home/affan/code/blockchain-inter/src/hooks/useNGOData.js)**: A powerful hook that scans `NGORegistered` events to dynamically build the platform's NGO registry. No more hardcoded data.
- **Live Statistics**: Platform-wide metrics (Total Donations, Active NGOs, Unique Donors) are fetched directly from the `getPlatformStats` contract function.

### Dynamic Home Page
- **[Stats.jsx](file:///home/affan/code/blockchain-inter/src/components/home/Stats.jsx)**: Displays vibrant, real-time counters for platform impact.
- **[RecentDonations.jsx](file:///home/affan/code/blockchain-inter/src/components/home/RecentDonations.jsx)**: A live activity feed that listens for `DonationReceived` events and provides direct links to Polygonscan.
- **[FeaturedNGOs-improved.jsx](file:///home/affan/code/blockchain-inter/src/components/home/FeaturedNGOs-improved.jsx)**: Now displays real NGO profiles with dynamic withdrawal counts and trust scores.

### Enhanced Navigation
- **[NGO List Page](file:///home/affan/code/blockchain-inter/src/app/ngos/page.jsx)**: A full-screen discovery portal with search, category filtering, and grid/list view toggles.
- **[NGO Detail Page](file:///home/affan/code/blockchain-inter/src/app/ngos/%5Bid%5D/page.jsx)**: In-depth profile views for each NGO, showing their specific mission, total impact, and individual donation history.

---

## 🛠️ Implementation Details

### Core Hook: [useNGODashboard.js](file:///home/affan/code/blockchain-inter/src/hooks/useNGODashboard.js)
This hook centralizes all interaction with the `DonationPlatform.sol` contract for NGO operations:
- [getNGOInfo](file:///home/affan/code/blockchain-inter/src/hooks/useDonationContract.js#55-74): Fetches metadata and withdrawal stats.
- [getNGOBalance](file:///home/affan/code/blockchain-inter/src/hooks/useDonationContract.js#35-54): Fetches individual token balances.
- `createWithdrawalRequest`: Submits new requests.
- `executeWithdrawal`: Calls the contract function to release funds.

### UI Components
- **[DashboardLayout.jsx](file:///home/affan/code/blockchain-inter/src/components/ngo/DashboardLayout.jsx)**: A modern, sidebar-based navigation system for the NGO portal.
- **[BalanceOverview.jsx](file:///home/affan/code/blockchain-inter/src/components/ngo/BalanceOverview.jsx)**: Card-based financial stats with hover effects.
- **[WithdrawalForm.jsx](file:///home/affan/code/blockchain-inter/src/components/ngo/WithdrawalForm.jsx)**: Validated form for requesting funds.
- **[RequestList.jsx](file:///home/affan/code/blockchain-inter/src/components/ngo/RequestList.jsx)**: Professional data table with status indicators.

## 📸 Component Showcase

````carousel
```javascript
// Simple access check in page.jsx
if (isNGO === false) {
    return <AccessDenied />;
}
```
<!-- slide -->
```javascript
// Balance fetching logic in hook
for (const [key, token] of Object.entries(SUPPORTED_TOKENS)) {
    const balance = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: DonationPlatformABI,
        functionName: 'getNGOBalance',
        args: [address, token.address],
    });
    // ...
}
```
````

## Phase 5: Admin Panel (Complete) 🛡️

The administrative control center for the platform owners is now fully implemented with a multi-page architecture.

### Admin Dashboard Structure
Accessed via `/admin/dashboard`, the panel is split into logical management areas:
- **NGO Registry** (`/admin/ngos`): Register new organizations and toggle their active status.
- **Token Pool** (`/admin/tokens`): Manage whitelisted ERC20 tokens and donation limits.
- **System Settings** (`/admin/settings`): Configure platform fees, fee collectors, and emergency circuit breakers.

### Technical Implementation
1. **[useAdmin.js](file:///home/affan/code/blockchain-inter/src/hooks/useAdmin.js)**: A specialized hook for protocol governors.
   - NGO registration with `bytes32` name hashing.
   - Dynamic token whitelisting and limit configuration.
   - Emergency system pause/unpause.
2. **[AdminLayout.jsx](file:///home/affan/code/blockchain-inter/src/components/admin/AdminLayout.jsx)**: A professional, sidebar-based layout with built-in wallet connection and route protection.
3. **Optimized UX**: Each section has its own dedicated page for better organization and scalability.

---

## 📸 Admin Showcase

````carousel
```javascript
// useAdmin hook signature
const { registerNGO, whitelistToken, pause } = useAdmin();
```
<!-- slide -->
```javascript
// Example: Registering an NGO via the Admin Panel
await registerNGO(ngoAddress, "Save the Planet", approvers, 2);
```
````

## Phase 6: Testing & Polish (In Progress) 🎨

This final phase focuses on consolidating the platform into a cohesive, production-ready application.

### Global App Structure
- **Unified Layout**: Implemented a global root layout with Lexend and Poppins typography.
- **Dynamic Header/Footer**: Added a responsive navigation system and platform-wide footer.
- **Provider Refactoring**: Created [ProvidersClient](file://wsl.localhost/Ubuntu/home/affan/code/blockchain-inter/src/components/ProvidersClient.jsx#7-31) to manage Web3 and UI providers in one place.

### Phase 6: Testing & Polish ✅
- **Web3 Configuration Fix**: Resolved critical `TypeError` in [web3Config.js](file:///home/affan/code/blockchain-inter/src/utils/web3Config.js) by refactoring for `wagmi` v1 compatibility.
- **Home Page Consolidation**: Promoted high-fidelity components ([Hero](file:///home/affan/code/blockchain-inter/src/components/home/Hero-improved.jsx#6-147), [FeaturedNGOs](file://wsl.localhost/Ubuntu/home/affan/code/blockchain-inter/src/components/home/FeaturedNGOs.jsx#9-176), [HowItWorks](file:///home/affan/code/blockchain-inter/src/components/home/HowItWorks.jsx#6-135)) and merged them into a unified, responsive lander.
- **NGO Detail Skeletal UI**: Replaced the basic spinner with a premium skeletal loading state on NGO detail pages.
- **NGO Registration Gateway**: Created a dedicated `/register-ngo` page for new organizations to apply for listing.
- **Protocol Status Monitoring**: Updated [useNGOData](file:///home/affan/code/blockchain-inter/src/hooks/useNGOData.js#9-162) to monitor the platform's `paused` state for real-time maintenance feedback.
- **Responsive Audit**: Verified and fixed responsiveness for all key donation and management flows.
- **Identifier Standardization**: Aligned all hooks and components to use `address` consistently as the primary NGO identifier.

### Verification Tasks
- [x] Global layout and font integration.
- [x] Responsive header with wallet connection.
- [x] Standardized addressing across all components.

## 📉 Status
- [x] Dashboard Layout Implementation
- [x] NGO Hook Development
- [x] Balance & Stats Display
- [x] Withdrawal Request Flow
- [x] Access Control Logic
- [/] Phase 6: Final Polish
