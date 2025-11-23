'use client';

import React, { useState, useRef } from 'react';
import { Upload, Wand2, Loader2, Image as ImageIcon, RefreshCw, ChevronsLeftRight, Sparkles, DollarSign } from 'lucide-react';
import { TransformationState, Region } from '../types';
// API routes for AI services (server-side only)
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ImageAnnotator } from './ImageAnnotator';
import { QuoteDisplay } from './QuoteDisplay';

export const VirtualPlanner: React.FC = () => {
  const [state, setState] = useState<TransformationState>({
    originalImage: null,
    generatedImage: null,
    prompt: "",
    isLoading: false,
    error: null,
    suggestions: [],
    isAnalyzing: false,
    quote: null,
    isGeneratingQuote: false
  });
  
  const [region, setRegion] = useState<Region | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setState(prev => ({ ...prev, error: "Image too large. Please choose an image under 5MB." }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageBase64 = reader.result as string;
        
        setState({
          originalImage: imageBase64,
          generatedImage: null,
          prompt: "",
          isLoading: false,
          error: null,
          suggestions: [],
          isAnalyzing: true,
          quote: null,
          isGeneratingQuote: false
        });
        setRegion(null);

        try {
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageBase64 })
            });
            const result = await response.json();
            if (result.success) {
              setState(prev => ({ ...prev, suggestions: result.data, isAnalyzing: false }));
            } else {
              throw new Error(result.error);
            }
        } catch (err) {
            console.error("Analysis failed", err);
            setState(prev => ({ ...prev, isAnalyzing: false }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;
    if (!state.prompt.trim()) {
        setState(prev => ({ ...prev, error: "Please describe the transformation." }));
        return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, quote: null }));

    try {
      const renderResponse = await fetch('/api/landscape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'render',
          imageBase64: state.originalImage,
          instructions: state.prompt,
          region: region || undefined
        })
      });
      const renderResult = await renderResponse.json();

      if (!renderResult.success) {
        throw new Error(renderResult.error);
      }

      setState(prev => ({
        ...prev,
        generatedImage: renderResult.data,
        isLoading: false,
        isGeneratingQuote: true
      }));

      try {
        const quoteResponse = await fetch('/api/landscape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'quote',
            originalImage: state.originalImage,
            generatedImage: renderResult.data,
            prompt: state.prompt
          })
        });
        const quoteResult = await quoteResponse.json();
        if (quoteResult.success) {
          setState(prev => ({ ...prev, quote: quoteResult.data, isGeneratingQuote: false }));
        } else {
          throw new Error(quoteResult.error);
        }
      } catch (quoteErr) {
        console.error("Quote failed", quoteErr);
        setState(prev => ({ ...prev, isGeneratingQuote: false }));
      }

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to transform image. Please try again."
      }));
    }
  };

  const useSuggestion = (s: string) => {
      setState(prev => ({ ...prev, prompt: s }));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <div className="grid lg:grid-cols-12 gap-0">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 p-8 md:p-10 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 flex flex-col h-full max-h-[800px] overflow-y-auto custom-scrollbar">
            
            {/* Upload Section */}
            <div className="mb-8">
            <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-3">1. Source Image</label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors group ${
                state.originalImage ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-green-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
            >
                <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
                />
                {state.originalImage ? (
                <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-400">
                    <span className="text-sm font-medium truncate">Image uploaded</span>
                    <RefreshCw size={16} className="text-green-500 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                ) : (
                <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 py-4">
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-sm">Click to upload</span>
                </div>
                )}
            </div>
            </div>

            {/* Prompt Section */}
            <div className="mb-8 flex-grow">
            <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-3 flex justify-between">
                <span>2. Design Instructions</span>
                {region && <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Active Region</span>}
            </label>
            <textarea
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder={region ? "Describe changes for the selected area..." : "Describe your dream landscape (e.g., 'Modern zen garden with stone path')..."}
                className="w-full p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[120px] resize-none placeholder-zinc-400 text-sm"
            />
            
            <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-purple-500" />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
                    {state.isAnalyzing ? "Analyzing terrain..." : "AI Ideas:"}
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                {state.isAnalyzing ? (
                    [1,2,3].map(i => <div key={i} className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg"></div>)
                ) : (
                    state.suggestions.length > 0 ? state.suggestions.map((p, idx) => (
                    <button
                        key={idx}
                        onClick={() => useSuggestion(p)}
                        className="text-xs bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800 px-3 py-1.5 rounded-lg transition-colors text-left"
                    >
                        {p}
                    </button>
                    )) : (
                        <p className="text-xs text-zinc-400 italic">Upload image for ideas.</p>
                    )
                )}
                </div>
            </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                {state.error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg mb-4">
                    {state.error}
                </div>
                )}
            <button
                onClick={handleGenerate}
                disabled={!state.originalImage || state.isLoading}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                !state.originalImage || state.isLoading
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-500 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5'
                }`}
            >
                {state.isLoading ? (
                <>
                    <Loader2 className="animate-spin" /> Rendering...
                </>
                ) : (
                <>
                    <Wand2 size={18} /> Generate Design
                </>
                )}
            </button>
            </div>
        </div>

        {/* Right Panel: Visualization & Tools */}
        <div className="lg:col-span-8 bg-zinc-900 flex flex-col items-center min-h-[600px] relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-center z-10">
            {state.generatedImage && state.originalImage ? (
                <div className="w-full max-w-4xl flex flex-col gap-8 animate-fade-in">
                    <div className="relative">
                            <BeforeAfterSlider 
                            beforeImage={state.originalImage}
                            afterImage={state.generatedImage}
                            className="h-[500px] shadow-2xl border-4 border-zinc-800 rounded-xl"
                        />
                        <p className="text-center text-zinc-500 text-xs mt-4 flex items-center justify-center gap-2">
                            <ChevronsLeftRight size={14} /> Drag slider to compare
                        </p>
                    </div>

                    <div className="w-full">
                        {state.isGeneratingQuote ? (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 flex items-center justify-center text-white gap-3 border border-white/10">
                                <Loader2 className="animate-spin text-green-400" />
                                <span className="text-sm">Estimating materials & labor...</span>
                            </div>
                        ) : state.quote ? (
                            <QuoteDisplay quote={state.quote} />
                        ) : null}
                    </div>
                </div>
            ) : state.originalImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center max-w-3xl">
                        <div className="relative w-full h-[500px] bg-zinc-800 rounded-xl border-4 border-zinc-800 shadow-2xl overflow-hidden">
                            <ImageAnnotator 
                            imageSrc={state.originalImage} 
                            region={region}
                            onRegionChange={setRegion}
                            className="w-full h-full"
                            />
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <div className="bg-zinc-800/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 border border-zinc-700">
                                <ImageIcon size={14} className="text-blue-400" />
                                Original
                            </div>
                            <div className="bg-zinc-800/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 border border-green-900/50">
                                <Sparkles size={14} className="text-green-400" />
                                Draw box to edit specific area
                            </div>
                        </div>
                </div>
            ) : (
                <div className="text-center text-zinc-500 p-8">
                    <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-zinc-700">
                        <ImageIcon className="text-zinc-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-300 mb-2">Start Your Project</h3>
                    <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm">Upload a photo to utilize our AI architect and quoting engine.</p>
                    
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-xs text-zinc-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-purple-400"><Sparkles size={14}/></div>
                            <span>AI Ideas</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-green-400"><Wand2 size={14}/></div>
                            <span>Render</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-yellow-400"><DollarSign size={14}/></div>
                            <span>Quote</span>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
        </div>
    </div>
  );
};