import React, { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { JupiterSwap } from './App';
import idl from './idl.json';
import './App.css';

// Constants
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
const NFT_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb156a8RQg1QoP');
const NETWORK = 'https://api.devnet.solana.com';

const SOL_TO_CHIPS = 10000;
const WELCOME_BONUS = 1000;

const NFT_TIERS = [
  { id: 1, name: 'Bronze Card', wins: 10, color: '#CD7F32', icon: '🥉', type: 'wins', label: '10 wins' },
  { id: 2, name: 'Silver Card', wins: 100, color: '#C0C0C0', icon: '🥈', type: 'wins', label: '100 wins' },
  { id: 3, name: 'Gold Card', wins: 500, color: '#FFD700', icon: '🥇', type: 'wins', label: '500 wins' },
  { id: 4, name: 'Diamond Card', wins: 1000, color: '#B9F2FF', icon: '💎', type: 'wins', label: '1,000 wins' },
  { id: 5, name: 'Card Shark', wins: 2500, color: '#3498db', icon: '🦈', type: 'wins', label: '2,500 wins' },
  { id: 6, name: 'High Roller', wins: 100000, color: '#9b59b6', icon: '👑', type: 'bets', label: '100K total bet' },
  { id: 7, name: 'Lucky Streak', wins: 10, color: '#e74c3c', icon: '🔥', type: 'streak', label: '10 in a row' },
];

const Blackjack = ({ wallet, publicKey, provider, program, connected }) => {
  const [game, setGame] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Connect your wallet to start');
  const [view, setView] = useState('home');
  const [chipBalance, setChipBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(100);
  const [welcomeBonusClaimed, setWelcomeBonusClaimed] = useState(false);
  const [claimedNfts, setClaimedNfts] = useState([]);
  const [walletName, setWalletName] = useState('');

  // Card helper
  const getCardName = (card) => {
    const names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♥', '♦', '♣'];
    const suit = suits[card % 4];
    const name = names[card % 13];
    return { name, suit, color: card % 4 === 0 || card % 4 === 3 ? 'red' : 'black' };
  };

  // Initialize on wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      const init = async () => {
        try {
          const connection = new Connection(NETWORK, 'processed');
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / 1e9);
          
          const walletAdapter = wallet?.adapter;
          if (walletAdapter) {
            setWalletName(walletAdapter.name || 'Wallet');
          }
          
          const claimed = localStorage.getItem('hit21_claimed_nfts');
          if (claimed) {
            setClaimedNfts(JSON.parse(claimed));
          }
          
          setStatus(`Connected with ${walletName || 'wallet'}!`);
        } catch (err) {
          console.error(err);
        }
      };
      init();
    }
  }, [connected, publicKey, wallet]);

  // Claim welcome bonus
  const claimWelcomeBonus = async () => {
    if (!program || !publicKey) return;
    setLoading(true);
    
    try {
      setChipBalance(prev => prev + WELCOME_BONUS);
      setWelcomeBonusClaimed(true);
      localStorage.setItem('hit21_welcome_claimed', 'true');
      
      setStatus(`🎉 Welcome bonus claimed! +${WELCOME_BONUS} chips!`);
    } catch (err) {
      console.error(err);
      setStatus('Error claiming bonus');
    }
    
    setLoading(false);
  };

  // Buy chips
  const buyChips = async (solAmount) => {
    if (!program || !publicKey) return;
    setLoading(true);
    
    try {
      const chipAmount = solAmount * SOL_TO_CHIPS;
      setChipBalance(prev => prev + chipAmount);
      setSolBalance(prev => prev - solAmount);
      
      setStatus(`💰 Bought ${chipAmount.toLocaleString()} chips for ${solAmount} SOL!`);
    } catch (err) {
      console.error(err);
      setStatus('Error buying chips');
    }
    
    setLoading(false);
  };

  // Start new game
  const startGame = async () => {
    if (!program || !publicKey) return;
    if (betAmount > chipBalance) {
      setStatus('Not enough chips!');
      return;
    }
    
    setLoading(true);
    
    try {
      const mockGame = {
        dealerHand: [Math.floor(Math.random() * 13), Math.floor(Math.random() * 13)],
        playerHand: [Math.floor(Math.random() * 13), Math.floor(Math.random() * 13)],
        dealerCount: 0,
        playerCount: 0,
        dealerCards: 2,
        playerCards: 2,
        gameState: 1,
        betAmount: betAmount,
      };
      
      mockGame.playerCount = mockGame.playerHand.reduce((sum, card) => {
        const val = card >= 9 ? 10 : card + 1;
        return sum + val;
      }, 0);
      
      mockGame.dealerCount = mockGame.dealerHand[0] >= 9 ? 10 : mockGame.dealerHand[0] + 1;
      
      setGame(mockGame);
      setChipBalance(prev => prev - betAmount);
      setStatus('🎰 Game started! Your turn.');
    } catch (err) {
      console.error(err);
    }
    
    setLoading(false);
  };

  // Hit
  const hit = async () => {
    if (!game) return;
    
    const card = Math.floor(Math.random() * 13);
    const cardValue = card >= 9 ? 10 : card + 1;
    
    const newHand = [...game.playerHand, card];
    let newCount = game.playerCount + cardValue;
    
    if (card === 0 && newCount > 21) newCount -= 10;
    
    const newGame = {
      ...game,
      playerHand: newHand,
      playerCount: newCount,
      playerCards: game.playerCards + 1,
    };
    
    if (newCount > 21) {
      newGame.gameState = 4;
      setPlayerState(prev => prev ? { ...prev, currentStreak: 0 } : null);
      setStatus('💀 Bust! You lost.');
    } else {
      setStatus('Hit or Stand?');
    }
    
    setGame(newGame);
  };

  // Stand
  const stand = async () => {
    if (!game) return;
    
    let dealerCount = game.dealerCount;
    let dealerHand = [...game.dealerHand];
    
    while (dealerCount < 17) {
      const card = Math.floor(Math.random() * 13);
      const cardValue = card >= 9 ? 10 : card + 1;
      dealerHand.push(card);
      dealerCount += cardValue;
      if (card === 0 && dealerCount > 21) dealerCount -= 10;
    }
    
    const newGame = {
      ...game,
      dealerHand,
      dealerCount,
      dealerCards: dealerHand.length,
      gameState: 3,
    };
    
    if (dealerCount > 21) {
      const winnings = game.betAmount * 2;
      setChipBalance(prev => prev + winnings);
      setPlayerState(prev => prev ? ({
        ...prev,
        totalWins: (prev.totalWins || 0) + 1,
        totalBet: (prev.totalBet || 0) + game.betAmount,
        currentStreak: (prev.currentStreak || 0) + 1
      }) : null);
      setStatus(`🎉 You won ${winnings.toLocaleString()} chips!`);
    } else if (dealerCount > game.playerCount) {
      setPlayerState(prev => prev ? ({
        ...prev,
        totalBet: (prev.totalBet || 0) + game.betAmount,
        currentStreak: 0
      }) : null);
      setStatus(`💀 Dealer wins.`);
    } else if (game.playerCount > dealerCount) {
      const winnings = game.betAmount * 2;
      setChipBalance(prev => prev + winnings);
      setPlayerState(prev => prev ? ({
        ...prev,
        totalWins: (prev.totalWins || 0) + 1,
        totalBet: (prev.totalBet || 0) + game.betAmount,
        currentStreak: (prev.currentStreak || 0) + 1
      }) : null);
      setStatus(`🎉 You won ${winnings.toLocaleString()} chips!`);
    } else {
      setChipBalance(prev => prev + game.betAmount);
      setPlayerState(prev => prev ? ({
        ...prev,
        totalBet: (prev.totalBet || 0) + game.betAmount
      }) : null);
      setStatus('🤝 Push! Bet returned.');
    }
    
    setGame(newGame);
  };

  // Claim NFT
  const claimNft = async (nftType) => {
    if (!program || !publicKey) return;
    setLoading(true);
    
    try {
      const [nftMint] = PublicKey.findProgramAddress(
        [Buffer.from('nft'), publicKey.toBuffer(), Buffer.from([nftType])],
        PROGRAM_ID
      );
      
      const [nftMetadata] = PublicKey.findProgramAddress(
        [Buffer.from('metadata'), NFT_METADATA_PROGRAM.toBuffer(), nftMint.toBuffer()],
        NFT_METADATA_PROGRAM
      );
      
      const [playerTokenAccount] = PublicKey.findProgramAddress(
        [publicKey.toBuffer(), program.id.toBuffer(), nftMint.toBuffer()],
        PROGRAM_ID
      );
      
      await program.rpc.claimNft(nftType, {
        accounts: {
          admin: publicKey,
          playerState: playerTokenAccount,
          nftMint: nftMint,
          playerNftAccount: playerTokenAccount,
          nftMetadata: nftMetadata,
          player: publicKey,
          tokenProgram: program.id,
          tokenMetadataProgram: NFT_METADATA_PROGRAM,
          associatedTokenProgram: program.id,
          systemProgram: program.id,
          rent: program.id,
        },
      });
      
      const newClaimed = [...claimedNfts, nftType];
      setClaimedNfts(newClaimed);
      localStorage.setItem('hit21_claimed_nfts', JSON.stringify(newClaimed));
      
      const tier = NFT_TIERS.find(t => t.id === nftType);
      setStatus(`🏆 ${tier.icon} ${tier.name} NFT minted to your wallet!`);
      
    } catch (err) {
      console.error(err);
      setStatus('Error claiming NFT');
    }
    
    setLoading(false);
  };

  // Check earned NFTs
  const getEarnedNfts = useCallback(() => {
    const earned = [];
    const wins = playerState?.totalWins || 0;
    const bet = playerState?.totalBet || 0;
    const streak = playerState?.currentStreak || 0;
    
    NFT_TIERS.forEach(tier => {
      const isClaimed = claimedNfts.includes(tier.id);
      let earnedNow = false;
      
      if (tier.type === 'wins' && wins >= tier.wins) earnedNow = true;
      if (tier.type === 'bets' && bet >= tier.wins) earnedNow = true;
      if (tier.type === 'streak' && streak >= tier.wins) earnedNow = true;
      
      earned.push({ ...tier, earned: earnedNow, claimed: isClaimed });
    });
    
    return earned;
  }, [playerState, claimedNfts]);

  // Card component
  const Card = ({ card, hidden }) => {
    if (hidden) return <div className="card hidden-card"><span>🃏</span></div>;
    const { name, suit, color } = getCardName(card);
    return (
      <div className={`card ${color}`}>
        <span className="card-top">{name}{suit}</span>
        <span className="card-center">{suit}</span>
        <span className="card-bottom">{name}{suit}</span>
      </div>
    );
  };

  const earnedNfts = getEarnedNfts();

  // Not connected view
  if (!connected) {
    return (
      <div className="hit21-app">
        <h1>🎰 Hit 21 🎰</h1>
        <div className="connect-prompt">
          <p>Connect your Solana wallet to play!</p>
          <p className="supported-wallets">
            Supported wallets: Phantom, Solflare, Backpack, Ledger, Trezor, Slope, Coinbase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hit21-app">
      <h1>🎰 Hit 21 🎰</h1>
      
      <div className="main-container">
        {/* Header */}
        <div className="header">
          <div className="balance-card">
            <span className="label">💰 SOL</span>
            <span className="value">{solBalance.toFixed(4)}</span>
          </div>
          <div className="balance-card">
            <span className="label">🎟️ Chips</span>
            <span className="value">{chipBalance.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Welcome Bonus */}
        {!welcomeBonusClaimed && view === 'home' && (
          <div className="welcome-banner">
            <div className="banner-content">
              <span className="banner-icon">🎁</span>
              <div className="banner-text">
                <h3>New Player Bonus!</h3>
                <p>Get {WELCOME_BONUS} free chips</p>
              </div>
              <button className="claim-btn" onClick={claimWelcomeBonus} disabled={loading}>
                Claim 🎁
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className="nav">
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>🏠</button>
          <button className={view === 'buy' ? 'active' : ''} onClick={() => setView('buy')}>💵</button>
          <button className={view === 'game' ? 'active' : ''} onClick={() => setView('game')}>🃏</button>
          <button className={view === 'rewards' ? 'active' : ''} onClick={() => setView('rewards')}>🏆</button>
        </div>
        
        <div className="status-bar">{status}</div>
        
        {/* Home */}
        {view === 'home' && (
          <div className="view home-view">
            <div className="welcome-card">
              <h2>🎰 Hit 21 Casino</h2>
              <p>The fully Web3 Blackjack experience!</p>
              <div className="features">
                <div className="feature">🃏 Play Blackjack</div>
                <div className="feature">💰 Buy Chips with SOL</div>
                <div className="feature">🏆 Win Real NFTs</div>
              </div>
              <button className="btn-primary big" onClick={() => setView('game')}>
                Play Now →
              </button>
            </div>
          </div>
        )}
        
        {/* Buy */}
        {view === 'buy' && (
          <div className="view buy-view">
            <h2>💵 Buy Chips</h2>
            
            {/* Jupiter Swap */}
            <div className="jupiter-section">
              <JupiterSwap 
                wallet={wallet}
                publicKey={publicKey}
                onSwapComplete={(chips) => {
                  setChipBalance(prev => prev + chips);
                  setView('game');
                }}
              />
            </div>
            
            <p className="divider">OR - Direct Purchase</p>
            <p>1 SOL = {SOL_TO_CHIPS.toLocaleString()} chips</p>
            
            <div className="buy-options">
              {[0.1, 0.25, 0.5, 1.0, 2.0].map((sol) => (
                <button key={sol} className="buy-btn" onClick={() => buyChips(sol)} disabled={sol > solBalance}>
                  {sol} SOL
                  <span>→ {(sol * SOL_TO_CHIPS).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Game */}
        {view === 'game' && (
          <div className="view game-view">
            <div className="hand-section">
              <h2>Dealer's Hand {game && game.gameState === 3 && `(${game.dealerCount})`}</h2>
              <div className="cards">
                {game && (
                  <>
                    <Card card={game.dealerHand[0]} hidden={game.gameState === 1} />
                    {Array.from({ length: game.dealerCards - 1 }).map((_, i) => (
                      <Card key={i} card={game.dealerHand[i + 1]} />
                    ))}
                  </>
                )}
              </div>
            </div>
            
            <div className="hand-section">
              <h2>Your Hand {game && `(${game.playerCount})`}</h2>
              <div className="cards">
                {game && game.playerCards > 0 && Array.from({ length: game.playerCards }).map((_, i) => (
                  <Card key={i} card={game.playerHand[i]} />
                ))}
              </div>
              {playerState && (
                <div className="streak-indicator">🔥 Streak: {playerState.currentStreak}</div>
              )}
            </div>
            
            {!game && (
              <div className="bet-input">
                <label>Bet:</label>
                <input type="number" value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)} min="100" />
                <span>chips</span>
              </div>
            )}
            
            <div className="actions">
              {!game ? (
                <button className="btn-primary" onClick={startGame} disabled={loading || betAmount > chipBalance}>
                  Deal 🎰
                </button>
              ) : game.gameState === 1 ? (
                <>
                  <button className="btn-hit" onClick={hit} disabled={loading}>🃏 Hit</button>
                  <button className="btn-stand" onClick={stand} disabled={loading}>✋ Stand</button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setGame(null)}>New Game 🎰</button>
              )}
            </div>
            
            <button className="back-btn" onClick={() => { setGame(null); setView('home'); }}>←</button>
          </div>
        )}
        
        {/* Rewards */}
        {view === 'rewards' && (
          <div className="view rewards-view">
            <h2>🏆 NFT Rewards</h2>
            
            <div className="stats">
              <div className="stat"><span className="label">Wins</span><span className="value">{playerState?.totalWins || 0}</span></div>
              <div className="stat"><span className="label">Claimed</span><span className="value">{claimedNfts.length}/{NFT_TIERS.length}</span></div>
              <div className="stat"><span className="label">Bet</span><span className="value">{(playerState?.totalBet || 0) / 1000}K</span></div>
            </div>
            
            <div className="nft-grid">
              {earnedNfts.map((tier) => (
                <div key={tier.id} className={`nft-card ${tier.earned ? 'earned' : 'locked'}`} style={{ borderColor: tier.color }}>
                  <div className="nft-image-container">
                    <img src={`/nfts/images/${tier.name.toLowerCase().replace(' ', '')}.svg`} alt={tier.name} />
                  </div>
                  <div className="nft-icon">{tier.icon}</div>
                  <div className="nft-name">{tier.name}</div>
                  <div className="nft-requirement">{tier.label}</div>
                  <div className="nft-status">
                    {tier.claimed ? (
                      <span className="claimed">✅ In Wallet</span>
                    ) : tier.earned ? (
                      <button className="claim-btn-small" onClick={() => claimNft(tier.id)} disabled={loading}>
                        Claim NFT
                      </button>
                    ) : (
                      <span>🔒</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="wallet-info">
              <h3>🎒 Your Wallet NFTs</h3>
              <p>NFTs are minted directly to your wallet!</p>
              <div className="nft-legend">
                {NFT_TIERS.map(tier => (
                  <div key={tier.id} className={`legend-item ${claimedNfts.includes(tier.id) ? 'earned' : ''}`}>
                    <span>{tier.icon}</span>
                    <span>{tier.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blackjack;
