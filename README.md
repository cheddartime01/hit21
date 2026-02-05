# 🎰 Hit 21 - Fully Web3 Blackjack

**Login with wallet → Play Blackjack → Win REAL NFTs that go to your wallet!**

A completely decentralized Blackjack casino on Solana where you **own your NFTs**.

## ✨ Web3 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Multi-Wallet Support** | Phantom, Solflare, Backpack, Ledger, Trezor, Slope, Coinbase |
| 🔄 **Jupiter Swap** | Built-in SOL ↔ CHIPS swap (powered by Jupiter) |
| 🎟️ **CHIPS Token** | SPL token for in-game currency |
| 🃏 **Blackjack** | On-chain game logic |
| 🏆 **Real NFTs** | Actually minted to YOUR wallet |
| 📱 **Mobile Ready** | Works on Solana Seeker |
| 🎁 **Welcome Bonus** | 1,000 free chips for new players |

## 💼 Supported Wallets

| Wallet | Platform | Status |
|--------|----------|--------|
| 🟣 Phantom | Browser Extension, iOS, Android | ✅ Supported |
| 🟠 Solflare | Browser Extension, iOS, Android | ✅ Supported |
| 🔵 Backpack | Browser Extension | ✅ Supported |
| 📱 Ledger | Hardware Wallet | ✅ Supported |
| 🔐 Trezor | Hardware Wallet | ✅ Supported |
| 🟢 Slope | Mobile App | ✅ Supported |
| 💙 Coinbase | Browser Extension, Mobile | ✅ Supported |

**Any Solana wallet using the standard Wallet Adapter will work!**

## 🎮 How It Works

```
1. Connect ANY Solana Wallet (Phantom, Solflare, Ledger, etc.)
         ↓
2. Claim 1,000 FREE chips (welcome bonus)
         ↓
3. Buy more chips with SOL (Jupiter swap or direct)
         ↓
4. Play Blackjack (on-chain game logic)
         ↓
5. Win NFTs! (minted directly to your wallet)
         ↓
6. NFTs appear in your wallet! (tradeable, sellable)
```

## 🔄 Jupiter Swap Integration

| Feature | Description |
|---------|-------------|
| 🌀 **Best Rates** | Jupiter finds the best swap routes across all DEXs |
| 🔒 **Secure** | Swaps execute through your wallet |
| ⚡ **Fast** | Optimized routing for best prices |
| 💱 **SOL ↔ CHIPS** | Swap directly in the app |

**Users can swap SOL for CHIPS without leaving the game!**

## 🎰 Game Features

- **Blackjack** - Hit, Stand, beat the dealer
- **Jupiter Swap** - Buy CHIPS directly in the app
- **Chips Economy** - Buy with SOL, play risk-free
- **Chips Economy** - Buy with SOL, play risk-free
- **NFT Rewards** - 7 tiers of achievements
- **Streak Tracking** - Consecutive wins matter
- **Progress** - Stats tracked on-chain

## 🏆 NFT Rewards (Actually in Your Wallet!)

| NFT | Requirement | Icon |
|-----|-------------|------|
| 🥉 Bronze Card | 10 wins | 🥉 |
| 🥈 Silver Card | 100 wins | 🥈 |
| 🥇 Gold Card | 500 wins | 🥇 |
| 💎 Diamond Card | 1,000 wins | 💎 |
| 🦈 Card Shark | 2,500 wins | 🦈 |
| 👑 High Roller | 100K total bet | 👑 |
| 🔥 Lucky Streak | 10 wins in a row | 🔥 |

**NFTs are REAL tokens minted to your Phantom wallet!**

## 🚀 Quick Start

### Prerequisites

1. **Phantom Wallet** - [Get Phantom](https://phantom.app)
2. **Solana CLI** - [Install](https://docs.solana.com/cli/install-solana-cli-tools)
3. **Anchor** - [Install](https://www.anchor-lang.com)
4. **Node.js** - [Download](https://nodejs.org/)

### Setup

```bash
cd solana-blackjack

# Install dependencies
./setup.sh

# Start local validator
solana-test-anchor build && anchor deploy
```

### Deploy Frontend

```bash
cd app
npm run build
vercel deploy
```

## 📱 Use on Seeker

1. Open **hit21.game** (after deployment)
2. Tap Phantom icon → Connect
3. Play Blackjack!
4. Win NFTs → Check Phantom wallet!

## 🛠️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    HIT 21 DAPP                      │
├─────────────────────────────────────────────────────┤
│  Frontend (React)                                   │
│  ├── Wallet Connection (Phantom)                     │
│  ├── Game UI                                         │
│  └── NFT Gallery                                     │
├─────────────────────────────────────────────────────┤
│  Programs (Solana/Anchor)                           │
│  ├── CHIPS Token (SPL)                               │
│  ├── Player State (PDA)                              │
│  ├── Game State (PDA)                                │
│  └── NFT Minter (Metaplex)                          │
├─────────────────────────────────────────────────────┤
│  NFTs (SFT-1)                                       │
│  ├── Minted to player wallet                         │
│  ├── Metadata on-chain                               │
│  └── Tradeable in marketplace                        │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
solana-blackjack/
├── programs/
│   └── blackjack/
│       └── src/
│           └── lib.rs          # 🎰 Full Rust program
├── app/
│   └── src/
│       ├── App.js             # React entry
│       ├── Blackjack.js       # 🎰 Game + NFT UI
│       └── idl.json           # Program interface
├── nfts/
│   ├── images/               # NFT card images
│   └── json/                 # Metadata
└── README.md
```

## 🎯 Key Functions

| Function | Description |
|----------|-------------|
| `initializePlayer()` | Create player state (runs on first login) |
| `claimWelcomeBonus()` | Get 1,000 free chips |
| `buyChips()` | Exchange SOL for chips |
| `initializeGame()` | Start new blackjack game |
| `hit()` | Player takes a card |
| `stand()` | Player ends turn |
| `claimNft()` | **Mint NFT to player wallet!** |

## 🔗 Resources

- [Solana Docs](https://docs.solana.com)
- [Anchor Framework](https://www.anchor-lang.com)
- [Phantom Wallet](https://phantom.app)
- [Metaplex](https://www.metaplex.com)
- [SPL Token](https://spl.solana.com/token)

## 🎓 Learning

This project teaches:
- ✅ Wallet authentication
- ✅ SPL token integration
- ✅ PDA (Program Derived Addresses)
- ✅ On-chain state management
- ✅ NFT minting (Metaplex)
- ✅ Frontend + Blockchain connection

## 📝 License

MIT - Have fun building!

---

**Built with ❤️ on Solana**

🎰 Good luck at the tables! 🃏🏆

💡 **Tip:** NFTs earned will appear in your Phantom wallet under "Collectibles"!
