import React, { useState } from 'react';
import { Send, Scale, Columns, Zap } from 'lucide-react';
import { AnalysisType } from '../services/geminiService';
import { cn } from '../lib/utils';

interface DecisionFormProps {
  onSubmit: (decision: string, type: AnalysisType) => void;
  isLoading: boolean;
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [decision, setDecision] = useState('');
  const [type, setType] = useState<AnalysisType>('pros-cons');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision.trim()) {
      onSubmit(decision, type);
    }
  };

  const types: { id: AnalysisType; label: string; icon: any; description: string }[] = [
    {
      id: 'pros-cons',
      label: 'Pros & Cons',
      icon: Scale,
      description: 'A balanced look at the advantages and disadvantages.'
    },
    {
      id: 'comparison',
      label: 'Comparison',
      icon: Columns,
      description: 'Side-by-side analysis of multiple options or alternatives.'
    },
    {
      id: 'swot',
      label: 'SWOT Analysis',
      icon: Zap,
      description: 'Strengths, Weaknesses, Opportunities, and Threats.'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="decision" className="text-sm font-medium text-zinc-700">
          What decision are you weighing?
        </label>
        <textarea
          id="decision"
          placeholder="e.g., Should I move to a new city for a job? or Compare React vs Vue for my next project."
          className="w-full min-h-[120px] p-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none text-zinc-800"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            disabled={isLoading}
            className={cn(
              "flex flex-col items-start p-4 rounded-xl border transition-all text-left group",
              type === t.id
                ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200"
                : "bg-white border-zinc-200 hover:border-emerald-200 hover:bg-zinc-50"
            )}
          >
            <t.icon className={cn(
              "w-5 h-5 mb-2",
              type === t.id ? "text-emerald-600" : "text-zinc-400 group-hover:text-emerald-500"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              type === t.id ? "text-emerald-900" : "text-zinc-900"
            )}>
              {t.label}
            </span>
            <span className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {t.description}
            </span>
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !decision.trim()}
        className="w-full bg-zinc-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-200"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Analyze Decision
          </>
        )}
      </button>
    </form>
  );
}
