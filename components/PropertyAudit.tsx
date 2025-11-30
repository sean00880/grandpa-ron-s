'use client';
import Image from 'next/image';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, TrendingUp, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
// API route for property audit (server-side only)
import { PropertyReport } from '../types';

export const PropertyAudit: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [report, setReport] = useState<PropertyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          setError("Image too large. Max 5MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setReport(null); 
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAudit = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image })
      });
      const result = await response.json();
      if (result.success) {
        setReport(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      setError("Could not analyze image. Please try a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-0">
        
        {/* Left Panel: Input */}
        <div className="lg:col-span-4 p-8 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
            <h3 className="font-heading font-normal text-xl text-zinc-900 dark:text-white mb-2">Property Diagnostic</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Upload a photo to get an instant ROI analysis and health score.</p>

            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div 
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                    image ? 'border-green-500' : 'border-zinc-300 dark:border-zinc-700 hover:border-green-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
                >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                
                {image ? (
                    <Image src={image} alt="Audit Subject" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-zinc-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                    </div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Upload Photo</span>
                    </div>
                )}
                
                {image && !isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full text-xs">Change Photo</span>
                    </div>
                )}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <button
                onClick={runAudit}
                disabled={!image || isLoading}
                className={`w-full mt-4 py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    !image || isLoading
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                    : 'bg-green-600 text-white hover:bg-green-500 shadow-lg hover:shadow-green-500/20'
                }`}
                >
                {isLoading ? <><Loader2 className="animate-spin" size={16} /> Analyzing...</> : "Run Diagnostic"}
                </button>
            </div>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-8 p-8 bg-white dark:bg-zinc-950 min-h-[500px]">
          {isLoading && (
             <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin mb-6"></div>
                <h3 className="font-heading font-normal text-2xl text-zinc-900 dark:text-white">Scanning Vegetation...</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs">Analyzing weed density, grass coloration, and hardscape integrity.</p>
             </div>
          )}

          {!isLoading && !report && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
               <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-300 dark:text-zinc-700">
                  <TrendingUp size={40} />
               </div>
               <p className="text-zinc-400 dark:text-zinc-600 font-medium">Results will appear here</p>
            </div>
          )}

          {report && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Score */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                 <div>
                    <h2 className="font-heading font-normal text-3xl text-zinc-900 dark:text-white mb-1">Property Health Score</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">{report.summary}</p>
                 </div>
                 <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className={`text-4xl font-black ${getScoreColor(report.overallScore)}`}>
                        {report.overallScore}
                    </div>
                    <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-tight">
                        / 100 <br/> POINTS
                    </div>
                 </div>
              </div>

              {/* Metrics */}
              <div className="grid sm:grid-cols-2 gap-4">
                {report.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">{metric.name}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                metric.status === 'Excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                metric.status === 'Good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                                metric.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>{metric.status}</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 mb-2">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-1000 ${
                                    metric.score > 80 ? 'bg-green-500' : metric.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${metric.score}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{metric.details}</p>
                    </div>
                ))}
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <DollarSign className="text-green-600" size={16} />
                    Top ROI Improvements
                </h3>
                <div className="space-y-3">
                    {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-green-500/30">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{rec.title}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                                        rec.roi === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>{rec.roi} ROI</span>
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">{rec.description}</p>
                            </div>
                            <div className="text-right min-w-[100px]">
                                <span className="block font-bold text-zinc-900 dark:text-white text-sm">{rec.estimatedCost}</span>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-500">Est. Value Bump</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-green-900/20 dark:to-green-800/20 rounded-xl text-white flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-300 dark:text-green-200">Predicted Curb Appeal Boost</p>
                        <p className="font-bold text-lg">{report.curbAppealPrediction}</p>
                    </div>
                    <button className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                        Get Quote
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};