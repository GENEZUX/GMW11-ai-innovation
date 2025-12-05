import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { Video, Loader2, Upload, AlertCircle } from 'lucide-react';

const VeoVideo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [uploadedImage, setUploadedImage] = useState<{data: string, mimeType: string} | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt && !uploadedImage) return; // Prompt is usually optional if image is present, but good to have
    setLoading(true);
    setVideoUrl(null);
    try {
      const url = await generateVideo(prompt, aspectRatio, uploadedImage ? uploadedImage : undefined);
      setVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert('Video generation failed. Ensure you have selected a paid project API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const res = reader.result as string;
              setPreviewUrl(res);
              const base64 = res.split(',')[1];
              const mimeType = res.split(';')[0].split(':')[1];
              setUploadedImage({ data: base64, mimeType });
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Video className="text-green-400" /> Lyra Video Studio
        </h2>
        <p className="text-slate-500 text-sm mt-1">Generate high-quality 1080p videos with Veo 3. Paid API Key required.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A cinematic drone shot of a futuristic cyberpunk city..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white h-32 outline-none focus:border-green-500 transition-colors resize-none"
                    />
                </div>
                
                <div className="mb-6">
                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reference Image (Optional)</label>
                     <div className="flex gap-4 items-center">
                        <div className="relative w-24 h-24 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-green-500 transition-colors">
                            {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Upload className="text-slate-600" />}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="text-xs text-slate-500 flex-1">
                            Upload an image to animate it using Veo. The prompt will guide the animation.
                        </div>
                     </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
                    <div className="flex gap-3">
                        {['16:9', '9:16'].map(r => (
                            <button
                                key={r}
                                onClick={() => setAspectRatio(r as any)}
                                className={`flex-1 py-3 rounded-lg border text-sm font-bold transition-colors ${
                                    aspectRatio === r ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}
                            >
                                {r} {r === '16:9' ? '(Landscape)' : '(Portrait)'}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || (!prompt && !uploadedImage)}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-green-900/50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Video />}
                    Generate Video
                </button>
            </div>
            
            <div className="bg-amber-900/20 border border-amber-900/50 p-4 rounded-xl flex gap-3 text-amber-200 text-sm">
                <AlertCircle className="shrink-0" size={20} />
                <p>Video generation can take a minute or more. Please be patient.</p>
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[400px]">
            {videoUrl ? (
                <video controls autoPlay loop className="max-w-full max-h-full rounded-lg shadow-2xl">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="text-slate-600 flex flex-col items-center">
                    {loading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Video size={48} className="mb-4 text-green-500" />
                            <p>Generating your masterpiece...</p>
                        </div>
                    ) : (
                        <>
                            <Video size={48} className="mb-4 opacity-50" />
                            <p>Generated video will play here</p>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VeoVideo;