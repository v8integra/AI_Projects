/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Camera, 
  Layout, 
  Newspaper, 
  Share2, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  Monitor,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Medium = {
  id: string;
  name: string;
  icon: React.ReactNode;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  promptSuffix: string;
};

const MEDIUMS: Medium[] = [
  { 
    id: 'billboard', 
    name: 'Billboard', 
    icon: <Monitor className="w-5 h-5" />, 
    aspectRatio: '16:9',
    promptSuffix: 'displayed on a massive highway billboard at dusk, cinematic lighting, high-end advertising photography. No people.'
  },
  { 
    id: 'newspaper', 
    name: 'Newspaper', 
    icon: <Newspaper className="w-5 h-5" />, 
    aspectRatio: '3:4',
    promptSuffix: 'featured in a high-quality newspaper advertisement, clean layout, professional product photography. No people.'
  },
  { 
    id: 'social', 
    name: 'Social Post', 
    icon: <Share2 className="w-5 h-5" />, 
    aspectRatio: '1:1',
    promptSuffix: 'as a clean, minimalist social media studio shot, soft lighting, premium aesthetic. No people.'
  }
];

interface GeneratedImage {
  mediumId: string;
  url: string;
}

export default function App() {
  const [productDescription, setProductDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [masterPrompt, setMasterPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateBrand = useCallback(async () => {
    if (!productDescription.trim()) return;

    setIsGenerating(true);
    setError(null);
    setImages([]);

    try {
      // Step 1: Generate a consistent visual description using Gemini Text
      const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a highly detailed visual description for a product based on this description: "${productDescription}". 
        Focus on materials, colors, shape, and unique design elements. 
        IMPORTANT: Ensure the description explicitly excludes any people. 
        The description should be concise but vivid, suitable for an image generation prompt.`,
      });

      const visualDescription = textResponse.text || productDescription;
      setMasterPrompt(visualDescription);

      // Step 2: Generate images for each medium
      const generationPromises = MEDIUMS.map(async (medium) => {
        const fullPrompt = `${visualDescription} ${medium.promptSuffix}`;
        
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: medium.aspectRatio,
            },
          },
        });

        const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          return {
            mediumId: medium.id,
            url: `data:image/png;base64,${imagePart.inlineData.data}`
          };
        }
        throw new Error(`Failed to generate image for ${medium.name}`);
      });

      const results = await Promise.all(generationPromises);
      setImages(results);
    } catch (err) {
      console.error(err);
      setError('Something went wrong during generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [productDescription]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold tracking-tight text-lg">Brand Builder</h1>
          </div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            Visual Identity Engine
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Input Section */}
        <section className="max-w-2xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-medium tracking-tight mb-4">
              Imagine your product everywhere.
            </h2>
            <p className="text-zinc-500 mb-8">
              Describe your product and see it come to life across billboards, newspapers, and social media.
            </p>

            <div className="relative group">
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="e.g., A minimalist glass water bottle with a bamboo cap and a soft sage green silicone sleeve..."
                className="w-full h-32 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none text-zinc-800 placeholder:text-zinc-400"
              />
              <button
                onClick={generateBrand}
                disabled={isGenerating || !productDescription.trim()}
                className="absolute bottom-4 right-4 bg-zinc-900 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-zinc-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Build Brand
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mb-6" />
              <p className="text-zinc-500 font-medium animate-pulse">
                Crafting visual consistency across mediums...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          ) : images.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Master Prompt Info */}
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-zinc-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">Visual Blueprint</span>
                </div>
                <p className="text-zinc-700 italic leading-relaxed">
                  "{masterPrompt}"
                </p>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {MEDIUMS.map((medium) => {
                  const img = images.find(i => i.mediumId === medium.id);
                  return (
                    <motion.div
                      key={medium.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`relative group bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${
                        medium.id === 'billboard' ? 'lg:col-span-2' : ''
                      }`}
                    >
                      <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600">
                            {medium.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-zinc-900">{medium.name}</h3>
                            <p className="text-xs text-zinc-400 font-mono">{medium.aspectRatio} Aspect Ratio</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="relative aspect-video lg:aspect-auto overflow-hidden bg-zinc-50">
                        {img ? (
                          <img
                            src={img.url}
                            alt={`${medium.name} visualization`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-zinc-300"
            >
              <Layout className="w-16 h-16 mb-4 stroke-1" />
              <p className="text-lg">Your brand visualizations will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-zinc-100 text-center">
        <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
          Powered by Gemini Nano-Banana • No People Policy Enabled
        </p>
      </footer>
    </div>
  );
}
