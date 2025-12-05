

import React from 'react';
import { AppMode } from '../types';
import { 
  Terminal, 
  Cpu, 
  Aperture, 
  Clapperboard, 
  ScanEye, 
  Radio,
  Zap,
  Activity,
  Crown,
  Users,
  Megaphone
} from 'lucide-react';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
  const menuItems = [
    { mode: AppMode.SINGULARITY, label: 'Singularity Core', icon: <Crown size={20} className="text-purple-400" /> },
    { mode: AppMode.AI_FORGE, label: 'AI Forge (Entity Gen)', icon: <Users size={20} className="text-pink-400" /> },
    { mode: AppMode.CAMPAIGN_MANAGER, label: 'Campaign Command', icon: <Megaphone size={20} className="text-orange-400" /> },
    { mode: AppMode.CHAT, label: 'Command Terminal', icon: <Terminal size={20} /> },
    { mode: AppMode.LIVE, label: 'Neural Voice Link', icon: <Radio size={20} /> },
    { mode: AppMode.GENERATE_IMAGE, label: 'Visual Synthesis', icon: <Aperture size={20} /> },
    { mode: AppMode.GENERATE_VIDEO, label: 'Kinetic Engine', icon: <Clapperboard size={20} /> },
    { mode: AppMode.ANALYZE, label: 'Perception Unit', icon: <ScanEye size={20} /> },
    { mode: AppMode.TTS, label: 'Vocal Projector', icon: <Cpu size={20} /> },
  ];

  return (
    <div className="w-72 bg-[#020617] border-r border-purple-900/20 flex flex-col h-full shadow-2xl z-10 relative">
      {/* Subtle pulsing background for sidebar */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none"></div>

      <div className="p-6 border-b border-purple-900/20 relative z-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Crown size={24} className="text-white fill-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent tracking-tight">
                GMW 11
                </h1>
                <span className="text-[10px] tracking-[0.2em] text-purple-400 font-semibold uppercase">The Queen</span>
            </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-500/30 rounded text-xs text-purple-300">
            <Activity size={12} className="animate-pulse text-green-400" />
            <span>SYSTEM: DEC 2025</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              currentMode === item.mode
                ? 'bg-gradient-to-r from-purple-900/60 to-slate-900/50 text-white border-l-4 border-purple-500 shadow-lg shadow-purple-900/20'
                : 'text-slate-500 hover:bg-slate-900 hover:text-purple-300'
            }`}
          >
            <span className={`relative z-10 transition-transform duration-300 ${currentMode === item.mode ? 'scale-110 text-purple-300' : 'group-hover:scale-110'}`}>
                {item.icon}
            </span>
            <span className="font-medium text-sm tracking-wide relative z-10">{item.label}</span>
            {currentMode === item.mode && (
                <div className="absolute inset-0 bg-purple-500/5 blur-xl"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-5 border-t border-purple-900/20 relative z-10">
        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-purple-900/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Status</div>
            <div className="text-xs text-pink-400 font-mono glow-text flex items-center gap-1">
                <Zap size={10} className="text-yellow-400" /> AUTONOMOUS
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
