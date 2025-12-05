
import React, { useState } from 'react';
import { sendMessage } from '../services/geminiService';
import { 
  Calendar, 
  Megaphone, 
  TrendingUp, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Loader2,
  Image as ImageIcon,
  PenTool
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CampaignPost {
  day: number;
  weekday: string;
  focus: string;
  content: string;
  time: string;
  platform: string;
  isDone?: boolean;
}

const JANUARY_2026_DATA: CampaignPost[] = [
    { day: 1, weekday: "Thu", focus: "Arranque de año", content: "¡Bienvenido 2026! Auditoría GRATIS. Reserva en GMW11.", time: "11:00 AM", platform: "IG/FB" },
    { day: 2, weekday: "Fri", focus: "Prueba Social", content: "Testimonio: 'El REINICIO 2026 transformó mi logo'.", time: "7:00 PM", platform: "IG/FB" },
    { day: 3, weekday: "Sat", focus: "Descanso", content: "Historia: Encuesta de prioridades.", time: "-", platform: "Stories" },
    { day: 4, weekday: "Sun", focus: "Innovación", content: "Reel: Crea tu logo con IA en GMW11.", time: "11:00 AM", platform: "Reel" },
    { day: 5, weekday: "Mon", focus: "Promo Mes", content: "Paquete REINICIO 2026: -30% OFF. $1.950.000.", time: "7:00 PM", platform: "IG/FB" },
    { day: 6, weekday: "Tue", focus: "Leads", content: "¿Lista para despegar? Auditoría GRATIS.", time: "11:00 AM", platform: "IG/FB" },
    { day: 7, weekday: "Wed", focus: "Prueba Social", content: "Caso de éxito: Marca renovada en 7 días.", time: "7:00 PM", platform: "Reel" },
    { day: 8, weekday: "Thu", focus: "Energía Vehicular", content: "Wraps con IA: Diseños personalizados.", time: "11:00 AM", platform: "Reel" },
    { day: 9, weekday: "Fri", focus: "Promo Mes", content: "Wrap Vehicular 'Primer Trimestre' desde $2.290.000.", time: "7:00 PM", platform: "IG/FB" },
    { day: 10, weekday: "Sat", focus: "Descanso", content: "Countdown: Oferta Wrap cupos limitados.", time: "-", platform: "Stories" },
    { day: 15, weekday: "Thu", focus: "Moda/Textil", content: "Renueva línea 2026 con auditoría textil GRATIS.", time: "11:00 AM", platform: "IG/FB" },
    { day: 22, weekday: "Thu", focus: "Cierre Explosivo", content: "Combo REINICIO + Textiles con IA.", time: "11:00 AM", platform: "Reel" },
    { day: 30, weekday: "Fri", focus: "Prueba Social", content: "Resumen: Lo mejor de enero.", time: "7:00 PM", platform: "IG/FB" },
];

const CampaignManager: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<CampaignPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<{copy: string, visualPrompt: string} | null>(null);

  const handleGenerateAssets = async () => {
      if (!selectedPost) return;
      setLoading(true);
      setGeneratedAssets(null);
      
      try {
          const systemPrompt = `You are the Marketing Director for 'Barbosa Dsign / GMW11 AI Innovation'.
          We have a content calendar for January 2026. 
          Your task: Generate the specific social media asset data for the selected post.
          
          RETURN JSON ONLY:
          {
            "copy": "The full instagram caption including emojis, hooks, and hashtags (#Marca2026, #GMW11). Tone: Professional, innovative, urgent.",
            "visualPrompt": "A highly detailed Midjourney v7 prompt to create the background image for this post. Use style: Cyber-industrial, neon accents, high-end design agency aesthetic. --ar 4:5 --v 7"
          }`;

          const userPrompt = `Generate assets for this post:
          Focus: ${selectedPost.focus}
          Content Idea: ${selectedPost.content}
          Platform: ${selectedPost.platform}`;

          const res = await sendMessage(userPrompt, [], { 
              systemInstruction: systemPrompt,
              useThinking: true 
          });

          let cleanJson = res.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
          const data = JSON.parse(cleanJson);
          setGeneratedAssets(data);

      } catch (e) {
          console.error(e);
          alert("Generation failed.");
      } finally {
          setLoading(false);
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0c15] text-slate-200 font-inter overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-orange-900/20 bg-[#0b0c15]/95 backdrop-blur z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900/20 border border-orange-500/30 rounded">
                    <Megaphone size={20} className="text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        CAMPAIGN COMMAND <span className="text-xs text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">JAN 2026</span>
                    </h2>
                    <p className="text-xs text-slate-500 tracking-wide">STRATEGY: REINICIO 2026</p>
                </div>
            </div>
            <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    <TrendingUp size={14} className="text-green-500" />
                    TARGET: $15M COP
                </div>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Calendar Grid */}
            <div className="w-1/3 border-r border-slate-800 overflow-y-auto p-4 bg-[#05050a]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={14} /> Schedule Overview
                </h3>
                <div className="space-y-3">
                    {JANUARY_2026_DATA.map((post, idx) => (
                        <div 
                            key={idx}
                            onClick={() => { setSelectedPost(post); setGeneratedAssets(null); }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                                selectedPost?.day === post.day 
                                ? 'bg-orange-600/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    selectedPost?.day === post.day ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {post.weekday} {post.day}
                                </span>
                                <span className="text-[10px] text-slate-500 border border-slate-800 px-1 rounded">{post.time}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-200 mb-1">{post.focus}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{post.content}</p>
                            
                            {/* Hover Status */}
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <PenTool size={14} className="text-orange-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor / Generator */}
            <div className="flex-1 p-8 bg-[#0b0c15] overflow-y-auto relative">
                {selectedPost ? (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Brief */}
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-500" /> Strategy Brief
                                </h3>
                                <span className="text-xs font-mono text-orange-400 bg-orange-900/20 px-2 py-1 rounded border border-orange-500/20">
                                    {selectedPost.platform}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold">Focus</div>
                                    <div className="text-slate-300">{selectedPost.focus}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold">Concept</div>
                                    <div className="text-slate-300">{selectedPost.content}</div>
                                </div>
                            </div>
                        </div>

                        {/* Generator Controls */}
                        {!generatedAssets && (
                            <div className="text-center py-10">
                                <button 
                                    onClick={handleGenerateAssets}
                                    disabled={loading}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-orange-900/40 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <TrendingUp />}
                                    GENERATE ASSETS (AI)
                                </button>
                                <p className="text-xs text-slate-500 mt-4">
                                    Uses Gemini 3 Pro to write copy & Midjourney v7 to design visuals.
                                </p>
                            </div>
                        )}

                        {/* Results */}
                        {generatedAssets && (
                            <div className="space-y-6">
                                {/* Visual Prompt */}
                                <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-1">
                                    <div className="bg-[#050505] rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                                                <ImageIcon size={16} /> Midjourney V7 Prompt
                                            </h4>
                                            <button 
                                                onClick={() => copyToClipboard(generatedAssets.visualPrompt)}
                                                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Copy size={12} /> Copy
                                            </button>
                                        </div>
                                        <div className="p-3 bg-slate-900/50 rounded border border-slate-800 text-xs font-mono text-slate-300 break-words">
                                            {generatedAssets.visualPrompt}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                onClick={() => window.open(`https://www.midjourney.com/imagine?prompt=${encodeURIComponent(generatedAssets.visualPrompt)}`, '_blank')}
                                                className="flex-1 py-2 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg text-xs font-bold hover:bg-purple-600 hover:text-white transition-all"
                                            >
                                                OPEN MIDJOURNEY WEB
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Copy */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                                            <PenTool size={16} /> Caption / Copy
                                        </h4>
                                        <button 
                                            onClick={() => copyToClipboard(generatedAssets.copy)}
                                            className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <Copy size={12} /> Copy
                                        </button>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap font-sans">
                                        {generatedAssets.copy}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 select-none">
                        <Calendar size={64} className="mb-4" />
                        <h3 className="text-xl font-bold">SELECT A DATE</h3>
                        <p className="text-sm">Access campaign strategy & generate assets.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default CampaignManager;
