# Hit 21 NFT Images

This folder contains NFT images and metadata for the Hit 21 casino rewards.

## Structure

```
nfts/
├── images/
│   ├── bronze.svg      🥉 Bronze Card (10 wins)
│   ├── silver.svg      🥈 Silver Card (100 wins)
│   ├── gold.svg        🥇 Gold Card (500 wins)
│   ├── diamond.svg     💎 Diamond Card (1,000 wins)
│   ├── cardshark.svg   🦈 Card Shark (2,500 wins)
│   ├── highroller.svg  👑 High Roller (100K total bet)
│   ├── luckystreak.svg 🔥 Lucky Streak (10 in a row)
│   └── default.svg     Default NFT image
│
└── json/
    ├── bronze.json
    ├── silver.json
    ├── gold.json
    ├── diamond.json
    ├── cardshark.json
    ├── highroller.json
    ├── luckystreak.json
    └── default.json
```

## NFT Tiers

| Tier | Wins/Bet | Image |
|------|----------|-------|
| 🥉 Bronze | 10 wins | bronze.svg |
| 🥈 Silver | 100 wins | silver.svg |
| 🥇 Gold | 500 wins | gold.svg |
| 💎 Diamond | 1,000 wins | diamond.svg |
| 🦈 Card Shark | 2,500 wins | cardshark.svg |
| 👑 High Roller | 100K total bet | highroller.svg |
| 🔥 Lucky Streak | 10 in a row | luckystreak.svg |

## Image Format

All images are SVGs (Scalable Vector Graphics) for best quality at any size.

### SVG Template

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#COLOR1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#COLOR2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="#1a1a2e"/>
  <rect x="20" y="20" width="360" height="460" rx="20" fill="url(#grad)" stroke="#STROKE" stroke-width="4"/>
  <text x="200" y="180" font-family="Arial" font-size="80" fill="#fff" text-anchor="middle">EMOJI</text>
  <text x="200" y="280" font-family="Arial" font-size="36" fill="#fff" text-anchor="middle" font-weight="bold">TIER NAME</text>
  <text x="200" y="330" font-family="Arial" font-size="24" fill="#fff" text-anchor="middle">REQUIREMENT</text>
  <text x="200" y="420" font-family="Arial" font-size="18" fill="#COLOR1" text-anchor="middle">Hit 21 Casino</text>
</svg>
```

## Updating Images

1. Edit SVG files in `images/`
2. Update JSON files in `json/` if needed
3. Deploy to your web host

## Production URLs

When deployed, images will be at:
- `https://hit21.game/nfts/images/{tier}.svg`
- `https://hit21.game/nfts/json/{tier}.json`
