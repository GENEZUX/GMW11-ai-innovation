import React, { useState } from 'react';
import { analyzeMedia, transcribeAudio } from '../services/geminiService';
import { Eye, FileAudio, FileVideo, Image as ImageIcon, Upload, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Analyzer: React.FC = () => {
  const [file, setFile] = useState<{base64: string, mimeType: string, type: 'image'|'video'|'audio'} | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const res = reader.result as string;
            setPreview(res);
            const base64 = res.split(',')[1];
            const mimeType = res.split(';')[0].split(':')[1];
            
            let type: 'image'|'video'|'audio' = 'image';
            if (mimeType.startsWith('video/')) type = 'video';
            if (mimeType.startsWith('audio/')) type = 'audio';

            setFile({ base64, mimeType, type });
        };
        reader.readAsDataURL(f);
    }
  };

  const handleAnalyze = async () => {
      if (!file) return;
      setLoading(true);
      try {
          let text = '';
          if (file.type === 'audio') {
              text = await transcribeAudio(file.base64);
          } else {
              text = await analyzeMedia(file.base64, file.mimeType, prompt || "Analyze this.", file.type === 'video');
          }
          setResult(text);
      } catch (e) {
          console.error(e);
          setResult('Error during analysis.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
        <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                <Eye className="text-orange-400" /> Multimodal Analysis
            </h2>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6 overflow-hidden">
            <div className="flex flex-col space-y-6 overflow-y-auto pr-2">
                 <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800 transition-colors relative mb-6">
                        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {preview ? (
                             file?.type === 'video' ? <video src={preview} className="max-h-48 mx-auto rounded" controls /> :
                             file?.type === 'image' ? <img src={preview} className="max-h-48 mx-auto rounded" /> :
                             <div className="flex flex-col items-center"><FileAudio size={48} className="text-blue-400" /><span className="mt-2 text-sm">Audio File Loaded</span></div>
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center">
                                <Upload size={32} className="mb-2" />
                                <span className="font-medium">Upload Image, Video, or Audio</span>
                            </div>
                        )}
                    </div>

                    {file?.type !== 'audio' && (
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Question / Prompt</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="What is happening in this image/video?"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white h-24 outline-none focus:border-orange-500 transition-colors resize-none"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !file}
                        className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-orange-900/50"
                    >
                        {loading ? 'Analyzing...' : (file?.type === 'audio' ? 'Transcribe Audio' : 'Analyze Content')}
                    </button>
                 </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Analysis Result</h3>
                {result ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 italic">
                        Results will appear here...
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Analyzer;