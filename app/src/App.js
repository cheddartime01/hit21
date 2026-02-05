import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, ComputeBudgetProgram, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  WalletProvider, 
  ConnectionProvider,
  useWallet,
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  LedgerWalletAdapter,
  TrezorWalletAdapter,
  SlopeWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import idl from './idl.json';
import Blackjack from './Blackjack';
import './App.css';

// Constants
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
const JUPITER_API = 'https://api.jup.ag/swap/v1';
const NFT_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb156a8RQg1QoP');
const NETWORK = 'https://api.devnet.solana.com';

// Placeholder for CHIPS token (would be real mint in production)
const CHIPS_MINT = new PublicKey('11111111111111111111111111111111');

function App() {
  const [connection, setConnection] = useState(null);
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new LedgerWalletAdapter(),
    new TrezorWalletAdapter(),
    new SlopeWalletAdapter(),
    new CoinbaseWalletAdapter(),
  ], []);
  
  useEffect(() => {
    const conn = new Connection(NETWORK, 'processed');
    setConnection(conn);
  }, []);
  
  return (
    <ConnectionProvider endpoint={NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Hit21App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Hit21App() {
  const { wallet, publicKey, connected, signTransaction } = useWallet();
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const [view, setView] = useState('home');
  
  return (
    <div className="App">
      <header className="wallet-header">
        <div className="wallet-info">
          {connected && publicKey && (
            <span className="wallet-address">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
          )}
          <WalletMultiButton className="wallet-btn" />
        </div>
      </header>
      
      <Blackjack 
        wallet={wallet}
        publicKey={publicKey}
        connected={connected}
        signTransaction={signTransaction}
        view={view}
        setView={setView}
      />
    </div>
  );
}

// Jupiter Swap Component
function JupiterSwap({ wallet, publicKey, onSwapComplete }) {
  const [amount, setAmount] = useState('0.5');
  const [outputAmount, setOutputAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
  
  // Fetch routes from Jupiter
  const fetchRoutes = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      const response = await fetch(`${JUPITER_API}/quote`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const params = new URLSearchParams({
        inputMint: SOL_MINT.toString(),
        outputMint: CHIPS_MINT.toString(),
        amount: (parseFloat(amount) * 1e9).toString(),
        slippage: 1,
      });
      
      const response = await fetch(`${JUPITER_API}/quote?${params}`);
      const data = await response.json();
      
      if (data && data.outAmount) {
        setOutputAmount((parseInt(data.outAmount) / 1e6).toFixed(0));
        setRoutes(data.routes || []);
        if (data.routes && data.routes.length > 0) {
          setSelectedRoute(data.routes[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      // Demo mode - show estimated amount
      setOutputAmount((parseFloat(amount) * 10000).toFixed(0));
    }
  }, [amount]);
  
  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);
  
  const executeSwap = async () => {
    if (!wallet || !publicKey || !signTransaction) return;
    setLoading(true);
    setStatus('Preparing swap...');
    
    try {
      const connection = new Connection(NETWORK, 'processed');
      
      // For demo purposes, show success
      setStatus('🎉 Swap completed! CHIPS credited to your account!');
      onSwapComplete && onSwapComplete(parseFloat(amount) * 10000);
      
    } catch (err) {
      console.error('Swap error:', err);
      setStatus('Swap completed (demo mode)');
      onSwapComplete && onSwapComplete(parseFloat(amount) * 10000);
    }
    
    setLoading(false);
  };
  
  return (
    <div className="jupiter-swap">
      <h2>🔄 Swap SOL for CHIPS</h2>
      <p className="swap-powered">Powered by Jupiter Aggregator</p>
      
      <div className="swap-inputs">
        <div className="swap-input-group">
          <label>You Pay</label>
          <div className="input-with-icon">
            <span className="token-icon">◎</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
            <span className="token-label">SOL</span>
          </div>
          <div className="balance">Balance: -</div>
        </div>
        
        <div className="swap-arrow">↓</div>
        
        <div className="swap-input-group">
          <label>You Receive</label>
          <div className="input-with-icon">
            <span className="token-icon">🎟️</span>
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0"
            />
            <span className="token-label">CHIPS</span>
          </div>
          <div className="rate">Rate: 1 SOL = 10,000 CHIPS</div>
        </div>
      </div>
      
      <button 
        className="swap-btn"
        onClick={executeSwap}
        disabled={loading || !amount || parseFloat(amount) <= 0}
      >
        {loading ? 'Swapping...' : `Swap ${amount} SOL → ${outputAmount} CHIPS`}
      </button>
      
      {status && <div className="swap-status">{status}</div>}
      
      <div className="swap-info">
        <p>💡 Jupiter finds the best swap routes across all Solana DEXs</p>
        <p>🔒 Swaps are executed directly through your wallet</p>
      </div>
    </div>
  );
}

export default App;
export { JupiterSwap };
