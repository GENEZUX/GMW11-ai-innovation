
import React, { useState } from 'react';
import { sendMessage } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  Shield, 
  Heart, 
  Fingerprint, 
  RefreshCcw, 
  Save, 
  Terminal, 
  Cpu, 
  Crosshair, 
  Copy, 
  ExternalLink,
  Code
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ARCHETYPES = [
    "Cybernetic Guardian",
    "Ethereal Spirit",
    "Tactical Operative",
    "Neo-Tokyo Drifter",
    "High Fantasy Royal",
    "Apocalyptic Survivor",
    "Void Entity",
    "Cyber-Goth"
];

const PERSONALITIES = [
    "Tsundere (Cold/Hot)",
    "Kuudere (Cool/Calm)",
    "Genki (Energetic)",
    "Yandere (Obsessive)",
    "Dandere (Shy)",
    "Stoic Warrior",
    "Chaotic Neutral"
];

interface ForgeEntity {
    name: string;
    class: string;
    powerLevel: string;
    bio: string;
    ability: string;
    stats: {
        str: number;
        int: number;
        agl: number;
    };
    visualPrompt: string;
}

const AiForge: React.FC = () => {
  const [nameInput, setNameInput] = useState('');
  const [archetype, setArchetype] = useState(ARCHETYPES[0]);
  const [personality, setPersonality] = useState(PERSONALITIES[0]);
  const [extraTraits, setExtraTraits] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<ForgeEntity | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const handleForge = async () => {
    setLoading(true);
    setEntity(null);
    setLogs([]);
    addLog("INITIALIZING FORGE PROTOCOLS...");
    
    try {
        addLog("CONNECTING TO GEMINI 3 PRO...");
        
        const systemPrompt = `You are THE FORGE, an advanced AI entity generator. 
        Your task is to generate a detailed character profile and a highly optimized Midjourney V7 visual prompt based on user inputs.
        
        RETURN ONLY RAW JSON. DO NOT USE MARKDOWN BLOCK.
        Structure:
        {
            "name": "Character Name",
            "class": "Archetype/Class",
            "powerLevel": "S/A/B/C rank",
            "bio": "Short, compelling backstory (max 300 chars).",
            "ability": "Name of special ability",
            "stats": { "str": 0-100, "int": 0-100, "agl": 0-100 },
            "visualPrompt": "Detailed visual description for Midjourney. Include physical appearance, clothing, lighting, environment, and artistic style. Do NOT include aspect ratio flags here."
        }`;

        let visualGuidance = "For the 'visualPrompt', make it a masterpiece, 8k, highly detailed, cinematic lighting.";
        
        if (archetype === "Cyber-Goth") {
            visualGuidance += " EMPHASIS: Dark, atmospheric aesthetic. Environment: Industrial decay or neon-lit rain. Clothing: Heavy boots, leather, mesh, latex, bio-mechanical accessories, spikes. Lighting: Dramatic shadows, neon rim lighting against deep blacks. Mood: Melancholic, powerful, edgy.";
        }

        const userPrompt = `Generate an entity:
        Name Hint: ${nameInput || "Random cool name"}
        Archetype: ${archetype}
        Personality: ${personality}
        Traits: ${extraTraits}
        
        ${visualGuidance}`;

        const response = await sendMessage(userPrompt, [], { 
            systemInstruction: systemPrompt,
            useThinking: true // Enable thinking for better creativity
        });

        addLog("PARSING NEURAL DATA...");
        
        // Cleanup response to ensure valid JSON
        let cleanJson = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
        const data = JSON.parse(cleanJson) as ForgeEntity;
        
        // Add MJ V7 Parameters
        data.visualPrompt = `${data.visualPrompt} --ar 16:9 --v 7 --q 2 --stylize 750`;

        setEntity(data);
        addLog("ENTITY SYNTHESIS COMPLETE.");

    } catch (e) {
        console.error(e);
        addLog("CRITICAL ERROR: SYNTHESIS FAILED.");
        alert("The Forge encountered an error during synthesis.");
    } finally {
        setLoading(false);
    }
  };

  const openMidjourney = () => {
      if (!entity) return;
      // Midjourney Web Link format (approximate)
      const encoded = encodeURIComponent(entity.visualPrompt);
      window.open(`https://www.midjourney.com/imagine?prompt=${encoded}`, '_blank');
  };

  const copyPrompt = () => {
      if (!entity) return;
      navigator.clipboard.writeText('/imagine prompt: ' + entity.visualPrompt);
      addLog("MJ PROMPT COPIED TO CLIPBOARD.");
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-slate-100 overflow-hidden relative font-mono">
        {/* Background Grid & Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>

        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#050505]/95 backdrop-blur z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-900/20 border border-pink-500/30 rounded">
                    <Bot size={20} className="text-pink-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-widest text-white flex items-center gap-2">
                        THE FORGE <span className="text-[10px] text-slate-500 border border-slate-800 px-1 rounded">V1.0</span>
                    </h2>
                    <p className="text-[10px] text-pink-400 tracking-[0.2em] uppercase">Autonomous Entity Synthesis</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                    <Cpu size={14} /> CORE: ONLINE
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-xs text-green-500 bg-green-900/10 border border-green-900/30 px-3 py-1 rounded flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> SYSTEM READY
                </div>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden z-10">
            {/* LEFT: Control Panel */}
            <div className="w-full md:w-[400px] p-6 border-r border-slate-800 bg-[#080808] overflow-y-auto space-y-6 flex flex-col">
                
                <div className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <label className="text-[10px] font-bold text-pink-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Fingerprint size={12} /> Entity Identity
                        </label>
                        <input 
                            type="text" 
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            placeholder="NAME_OVERRIDE (Optional)"
                            className="w-full bg-black border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-pink-500 outline-none transition-colors font-mono placeholder:text-slate-700"
                        />
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Crosshair size={12} /> Class Selection
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ARCHETYPES.map(arch => (
                                <button 
                                    key={arch}
                                    onClick={() => setArchetype(arch)}
                                    className={`text-left px-3 py-2 rounded text-[10px] uppercase font-bold transition-all border ${
                                        archetype === arch 
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                                        : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'
                                    }`}
                                >
                                    {arch}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Heart size={12} /> Neural Matrix
                        </label>
                        <select 
                            value={personality}
                            onChange={e => setPersonality(e.target.value)}
                            className="w-full bg-black border border-slate-700 rounded-lg p-3 text-sm text-white outline-none mb-3"
                        >
                            {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <textarea 
                            value={extraTraits}
                            onChange={e => setExtraTraits(e.target.value)}
                            placeholder="Additional DNA markers (e.g. 'Cybernetic eye', 'Hates rain')..."
                            className="w-full bg-black border border-slate-700 rounded-lg p-3 text-sm text-white h-20 resize-none outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1"></div>

                <div className="space-y-2">
                    {/* Terminal Log */}
                    <div className="bg-black border border-slate-800 rounded-lg p-3 h-24 font-mono text-[10px] text-green-500 overflow-hidden flex flex-col justify-end">
                        {logs.map((log, i) => <div key={i} className="opacity-70">{log}</div>)}
                        {loading && <div className="animate-pulse">_PROCESSING...</div>}
                    </div>

                    <button 
                        onClick={handleForge}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        INITIALIZE FORGE
                    </button>
                </div>
            </div>

            {/* RIGHT: Visualization Panel */}
            <div className="flex-1 p-8 bg-[#030303] flex items-center justify-center relative overflow-y-auto">
                {entity ? (
                    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Entity Header */}
                        <div className="flex items-end justify-between mb-6 border-b border-slate-800 pb-4">
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tighter mb-1">{entity.name.toUpperCase()}</h1>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-pink-500 font-bold bg-pink-900/10 px-2 py-0.5 rounded border border-pink-500/20">{entity.class}</span>
                                    <span className="text-slate-500">|</span>
                                    <span className="text-slate-400">Power Level: <span className="text-yellow-400">{entity.powerLevel}</span></span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Generated ID</div>
                                <div className="font-mono text-slate-300">#{Math.floor(Math.random()*10000)}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Stats & Bio */}
                            <div className="space-y-6">
                                <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl relative">
                                    <div className="absolute top-0 right-0 p-3 opacity-20"><Fingerprint size={48} /></div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Bio-Data</h3>
                                    <p className="text-slate-300 leading-relaxed text-sm">{entity.bio}</p>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Special Ability</h4>
                                        <div className="text-pink-400 font-bold">{entity.ability}</div>
                                    </div>
                                </div>

                                {/* Stats Hexagon Simulation */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">STR</div>
                                        <div className="text-xl font-bold text-white">{entity.stats.str}</div>
                                        <div className="h-1 w-full bg-slate-800 mt-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500" style={{width: `${entity.stats.str}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">INT</div>
                                        <div className="text-xl font-bold text-white">{entity.stats.int}</div>
                                        <div className="h-1 w-full bg-slate-800 mt-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{width: `${entity.stats.int}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-xl text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">AGL</div>
                                        <div className="text-xl font-bold text-white">{entity.stats.agl}</div>
                                        <div className="h-1 w-full bg-slate-800 mt-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{width: `${entity.stats.agl}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual & MJ Integration */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-1 shadow-2xl">
                                    <div className="bg-black rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] border border-dashed border-slate-800 relative group overflow-hidden">
                                        <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Sparkles className="text-pink-500 mb-4 animate-pulse" size={32} />
                                        <p className="text-center text-slate-400 text-sm max-w-[80%] italic">
                                            "Visual data ready for rendering. Midjourney V7 link established."
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={openMidjourney}
                                        className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        <ExternalLink size={18} /> LAUNCH MIDJOURNEY PROTOCOL
                                    </button>
                                    
                                    <button 
                                        onClick={copyPrompt}
                                        className="w-full py-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 hover:text-white transition-colors"
                                    >
                                        <Copy size={16} /> COPY V7 PROMPT
                                    </button>

                                    <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-900 text-[10px] text-slate-500 font-mono break-all line-clamp-3">
                                        {entity.visualPrompt}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-20 select-none pointer-events-none">
                        <Terminal size={120} className="mx-auto text-slate-500 mb-6" />
                        <h1 className="text-6xl font-bold text-slate-800">THE FORGE</h1>
                        <p className="text-xl text-slate-700 mt-2 tracking-[0.5em]">AWAITING INPUT</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AiForge;
