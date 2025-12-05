import React, { useState, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Volume2, Play, Mic, Speaker } from 'lucide-react';
import { decode, decodeAudioData } from '../services/audioUtils';

const TTS: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSpeak = async () => {
    if (!text) return;
    setLoading(true);
    try {
        const base64Audio = await generateSpeech(text);
        if (base64Audio) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 24000});
            }
            const ctx = audioContextRef.current;
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
            
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
        }
    } catch (e) {
        console.error(e);
        alert('Failed to generate speech');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 items-center justify-center">
        <div className="w-full max-w-2xl">
            <div className="mb-8 text-center">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                     <Volume2 size={32} className="text-white" />
                 </div>
                 <h2 className="text-3xl font-bold text-white">Text to Speech</h2>
                 <p className="text-slate-400 mt-2">Powered by Gemini 2.5 Flash TTS</p>
            </div>

            <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to speak (e.g. 'Hello, how are you today?')"
                    className="w-full h-48 bg-slate-950 rounded-xl p-6 text-lg text-slate-200 outline-none resize-none placeholder:text-slate-600"
                />
            </div>

            <button
                onClick={handleSpeak}
                disabled={loading || !text}
                className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-lg transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? 'Generating Audio...' : <><Play fill="currentColor" /> Speak Text</>}
            </button>
        </div>
    </div>
  );
};

export default TTS;