import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResponse } from '../services/geminiService';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResponse;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="border-b border-zinc-200 pb-6">
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
          {result.title}
        </h2>
        <p className="mt-4 text-zinc-600 leading-relaxed text-lg">
          {result.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.sections.map((section, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              {getIcon(section.heading)}
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                {section.heading}
              </h3>
            </div>
            
            {section.type === 'list' && Array.isArray(section.content) && (
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-700 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            )}

            {section.type === 'text' && (
              <p className="text-zinc-700 leading-relaxed">
                {Array.isArray(section.content) 
                  ? (typeof section.content[0] === 'string' ? section.content[0] : JSON.stringify(section.content[0]))
                  : (typeof section.content === 'string' ? section.content : JSON.stringify(section.content))}
              </p>
            )}

            {section.type === 'table' && (
              <div className="overflow-x-auto">
                <ul className="space-y-3">
                  {Array.isArray(section.content) && section.content.map((item, i) => (
                    <li key={i} className="text-zinc-700 leading-relaxed">
                      {typeof item === 'string' ? item : JSON.stringify(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function getIcon(heading: string) {
  const h = heading.toLowerCase();
  if (h.includes('pro') || h.includes('strength')) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (h.includes('con') || h.includes('weakness')) return <XCircle className="w-4 h-4 text-rose-500" />;
  if (h.includes('opportunity')) return <AlertCircle className="w-4 h-4 text-amber-500" />;
  if (h.includes('threat')) return <AlertCircle className="w-4 h-4 text-red-500" />;
  return <Info className="w-4 h-4 text-zinc-400" />;
}
