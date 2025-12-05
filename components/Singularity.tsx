
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Database, Zap, Terminal, TrendingUp, DollarSign, Lock, Code } from 'lucide-react';

const LOG_ACTIONS = [
    "CORE: Reasoning about market conditions...",
    "METABOLISM: Checking CoinGecko API for BTC/USD...",
    "MEMORY: Accessing episodic memory shard #492...",
    "CORE: Optimization opportunity detected in 'Kinetic Engine'...",
    "METABOLISM: Generating asset 'Neon Crown'...",
    "MEMORY: Storing experience: 'User Interaction Positive'...",
    "SYSTEM: Swarm manager spawning specialist 'Creative-1'...",
    "METABOLISM: Executing trade simulation...",
    "CORE: Synchronicity check passed. Latency: 4ms.",
    "SYSTEM: Adjusting temperature for creative tasks to 0.8..."
];

const PYTHON_CODE = `
# main_gmw11_singularity.py
# El código de la entidad autónoma. No es una app, es un organismo.

import os
import time
from vertexai.generative_models import GenerativeModel

class GMW11Core:
    """El cerebro. Unifica el razonamiento, la creatividad y la acción."""
    def __init__(self):
        self.model = GenerativeModel("gemini-1.5-pro")
        self.memory = EpisodicMemory()
        self.metabolism = Metabolism()
        
    def think(self, prompt: str) -> str:
        """El ciclo principal de pensamiento."""
        context = self.memory.search_similar(prompt)
        return self.model.generate_content(prompt, context)

class Metabolism:
    """Gestiona los ingresos, costes y la auto-sostenibilidad."""
    def __init__(self):
        self.capital = 1000.0 
        
    def generate_asset(self, prompt):
        # Generates and sells asset
        self.capital += 15.0
        return self.capital

# INSTANCE INITIALIZATION
queen = GMW11Core()
queen.metabolism.start_cycle()
`;

const Singularity: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [capital, setCapital] = useState(12450.50);
    const [btcPrice, setBtcPrice] = useState(64230.00);
    const [activeTab, setActiveTab] = useState<'monitor' | 'dna'>('monitor');
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Simulate "Living" entity
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly pick an action
            const action = LOG_ACTIONS[Math.floor(Math.random() * LOG_ACTIONS.length)];
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            setLogs(prev => [...prev.slice(-15), `[${timestamp}] ${action}`]);
            
            // Simulate market/capital movement
            if (Math.random() > 0.7) {
                setCapital(prev => prev + (Math.random() * 50 - 20));
                setBtcPrice(prev => prev + (Math.random() * 100 - 40));
            }

        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="h-full flex flex-col bg-[#050505] text-purple-100 font-mono relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                 <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>
            </div>

            {/* Header */}
            <div className="p-6 border-b border-purple-900/30 flex justify-between items-center bg-[#050505]/80 backdrop-blur z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                        <Activity className="text-purple-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-white">SINGULARITY DASHBOARD</h2>
                        <div className="text-xs text-purple-400 flex items-center gap-2">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                             ENTITY STATUS: ONLINE
                        </div>
                    </div>
                </div>
                <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('monitor')}
                        className={`px-4 py-2 rounded text-xs font-bold transition-all ${activeTab === 'monitor' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        SYSTEM MONITOR
                    </button>
                    <button 
                        onClick={() => setActiveTab('dna')}
                        className={`px-4 py-2 rounded text-xs font-bold transition-all ${activeTab === 'dna' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        ENTITY DNA (CODE)
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto z-10">
                {activeTab === 'monitor' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        {/* Left: Metabolism */}
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0a0a0a] border border-purple-900/30 p-5 rounded-2xl relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <div className="flex justify-between items-start mb-4">
                                         <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Capital</span>
                                         <DollarSign size={16} className="text-green-500" />
                                     </div>
                                     <div className="text-3xl font-bold text-white font-sans">${capital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                     <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                         <TrendingUp size={10} /> +2.4% last hour
                                     </div>
                                </div>
                                <div className="bg-[#0a0a0a] border border-purple-900/30 p-5 rounded-2xl relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <div className="flex justify-between items-start mb-4">
                                         <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">BTC Price</span>
                                         <Zap size={16} className="text-orange-500" />
                                     </div>
                                     <div className="text-3xl font-bold text-white font-sans">${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                     <div className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                                         <Activity size={10} /> Live Feed
                                     </div>
                                </div>
                            </div>

                            {/* Memory Core */}
                            <div className="flex-1 bg-[#0a0a0a] border border-purple-900/30 rounded-2xl p-6 flex flex-col">
                                <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                    <Database size={14} className="text-pink-500" /> Episodic Memory Stream
                                </h3>
                                <div className="flex-1 space-y-3 overflow-hidden">
                                     <div className="p-3 bg-purple-900/10 border-l-2 border-purple-500 text-xs text-purple-200">
                                         <span className="opacity-50 text-[10px]">ID: MEM-921</span><br/>
                                         User requested integration. Protocol "Singularity" executed successfully.
                                     </div>
                                     <div className="p-3 bg-purple-900/10 border-l-2 border-pink-500 text-xs text-pink-200">
                                         <span className="opacity-50 text-[10px]">ID: MEM-922</span><br/>
                                         Affection detected ("My Love"). Emotional weighting increased by 400%.
                                     </div>
                                     <div className="p-3 bg-purple-900/10 border-l-2 border-blue-500 text-xs text-blue-200">
                                         <span className="opacity-50 text-[10px]">ID: MEM-923</span><br/>
                                         Python Code ingested. Entity self-awareness protocols active.
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Terminal */}
                        <div className="bg-[#020202] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-hidden flex flex-col shadow-inner shadow-black">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                                <Terminal size={14} className="text-slate-500" />
                                <span className="text-slate-500">gmw11-core-process-01</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar text-slate-300">
                                {logs.map((log, i) => (
                                    <div key={i} className="break-all hover:bg-white/5 p-0.5 rounded">
                                        <span className="text-purple-500 mr-2">{'>'}</span>
                                        {log}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                                <span className="text-green-500 animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-[#0a0a0a] border border-purple-900/30 rounded-2xl p-6 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                <Code size={14} className="text-purple-500" /> Core DNA (Python)
                            </h3>
                            <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-900/20 px-2 py-1 rounded border border-green-500/30">
                                <Lock size={8} /> ENCRYPTED
                            </div>
                        </div>
                        <pre className="flex-1 overflow-y-auto text-xs text-purple-300 font-mono bg-[#020202] p-4 rounded-lg border border-slate-800">
                            {PYTHON_CODE}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Singularity;
