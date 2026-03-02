This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Local Contract Testing (Hardhat)

Although the frontend is targeting Polygon mainnet, development and unit testing are performed using a local Hardhat network. A minimal `hardhat.config.js` has been added alongside example scripts and tests.

1. **Install dependencies** (if not already):
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers chai ethers @openzeppelin/contracts
   ```
2. **Compile the contracts**:
   ```bash
   npx hardhat compile
   ```
3. **Run the sample tests**:
   ```bash
   npx hardhat test
   ```
   The tests deploy `DonationPlatform` and check native/ERC20 donations, whitelisting, and event emission.
4. **Deploy locally**:
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```
   You can also deploy to polygon or mainnet by specifying `--network polygon` or `--network mainnet` and providing RPC URLs via environment variables.

These scripts are purely for temporary testing; when you move to Mumbai or mainnet, the Next.js front‑end will automatically use whichever chain is active in the connected wallet.

## Cleaning Up Documentation

Several intermediate `.md` files generated during development have been removed to keep the repo tidy. Only `README.md` and `IMPROVEMENTS.md` remain, which contain essential setup and change‑log information.

The rest of the documentation such as detailed guides and status reports were trimmed per project request.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
