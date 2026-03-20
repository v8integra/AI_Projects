import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, RefreshCcw, Sparkles } from 'lucide-react';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisResult } from './components/AnalysisResult';
import { getDecisionAnalysis, AnalysisType, AnalysisResponse } from './services/geminiService';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (decision: string, type: AnalysisType) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDecisionAnalysis(decision, type);
      setResult(data);
    } catch (err) {
      setError('Something went wrong while analyzing. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              The Tiebreaker
            </h1>
          </div>
          
          {result && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest border border-emerald-100">
                  <Sparkles className="w-3 h-3" />
                  AI Decision Assistant
                </div>
                <h2 className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                  Make better choices, <br />
                  <span className="text-emerald-600">faster.</span>
                </h2>
                <p className="text-lg text-zinc-500 max-w-lg mx-auto leading-relaxed">
                  Stuck on a tough call? Provide your options and let AI break down the pros, cons, and strategic implications.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
                <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm text-center">
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <AnalysisResult result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} The Tiebreaker. Powered by Gemini AI.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Terms</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
