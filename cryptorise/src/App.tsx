import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Info, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { CryptoCoin, Screen } from './types';
import { cn } from './lib/utils';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError('Unable to load market data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-bg flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CryptoRise</h1>
        </div>
        <button 
          onClick={() => setScreen(screen === 'home' ? 'about' : 'home')}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          {screen === 'home' ? <Info className="w-6 h-6 text-ink-muted" /> : <ArrowLeft className="w-6 h-6 text-ink-muted" />}
        </button>
      </header>

      <main className="flex-1 px-6 pb-24 z-10">
        <AnimatePresence mode="wait">
          {screen === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-semibold">Top Gainers</h2>
                  <p className="text-sm text-ink-muted">Last 24 hours</p>
                </div>
                <button 
                  onClick={fetchCoins}
                  disabled={loading}
                  className="flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="space-y-4 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-card/50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="pt-20 text-center space-y-4">
                  <p className="text-ink-muted">{error}</p>
                  <button 
                    onClick={fetchCoins}
                    className="px-6 py-2 bg-accent rounded-full text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {coins.map((coin, index) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-card hover:bg-card/80 border border-white/5 p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-10 h-10 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -top-1 -left-1 w-5 h-5 bg-bg border border-white/10 rounded-full flex items-center justify-center text-[10px] font-bold text-ink-muted">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm uppercase tracking-wider">{coin.symbol}</h3>
                          <p className="text-xs text-ink-muted">{coin.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium">
                          ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-success font-bold text-xs">
                          <TrendingUp className="w-3 h-3" />
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">About CryptoRise</h2>
                <div className="w-12 h-1 bg-accent rounded-full" />
              </div>

              <div className="space-y-6 text-ink-muted leading-relaxed">
                <p>
                  CryptoRise is a minimalist, high-performance tracking tool designed for investors who want to stay ahead of the market.
                </p>
                <p>
                  Our algorithm scans thousands of digital assets in real-time to identify the <span className="text-ink font-medium">top 10 fastest rising cryptocurrencies</span> over the last 24-hour window.
                </p>
                
                <div className="bg-card border border-white/5 p-6 rounded-2xl space-y-4">
                  <h3 className="text-ink font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Key Features
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      Real-time market data via CoinGecko
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      24-hour percentage change tracking
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      Slick, professional dark-mode interface
                    </li>
                  </ul>
                </div>

                <p className="text-xs pt-4">
                  Data provided by CoinGecko. Market volatility is high; always conduct your own research before investing.
                </p>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => setScreen('home')}
                  className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2"
                >
                  Back to Market
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-bg/80 backdrop-blur-xl border-t border-white/5 px-12 py-6 flex justify-around items-center z-20">
        <button 
          onClick={() => setScreen('home')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            screen === 'home' ? "text-accent scale-110" : "text-ink-muted hover:text-ink"
          )}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Market</span>
        </button>
        <button 
          onClick={() => setScreen('about')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            screen === 'about' ? "text-accent scale-110" : "text-ink-muted hover:text-ink"
          )}
        >
          <Info className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">About</span>
        </button>
      </nav>
    </div>
  );
}
