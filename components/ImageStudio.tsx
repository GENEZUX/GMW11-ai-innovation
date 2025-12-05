import React, { useState } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { Download, Sparkles, Image as ImageIcon, Wand2, RefreshCcw } from 'lucide-react';

const ImageStudio: React.FC = () => {
  const [tab, setTab] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Config
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [size, setSize] = useState<ImageSize>(ImageSize.ONE_K);

  const handleCreate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await generateImage(prompt, aspectRatio, size);
      // Iterate parts for image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!prompt || !uploadedImage) return;
    setLoading(true);
    setResult(null);
    try {
      // uploadedImage is data URL "data:image/png;base64,..."
      // Extract base64
      const base64 = uploadedImage.split(',')[1];
      const mimeType = uploadedImage.split(';')[0].split(':')[1];
      
      const response = await editImage(base64, prompt, mimeType);
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
        console.error(e);
        alert('Editing failed');
    } finally {
        setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setUploadedImage(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lyra Image Studio</h2>
        <div className="bg-slate-800 rounded-lg p-1 flex text-sm font-medium">
          <button 
            onClick={() => setTab('create')}
            className={`px-4 py-1.5 rounded-md transition-all ${tab === 'create' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Create
          </button>
          <button 
            onClick={() => setTab('edit')}
            className={`px-4 py-1.5 rounded-md transition-all ${tab === 'edit' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
             {tab === 'create' ? (
                 <>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(AspectRatio).map(ar => (
                                <button
                                    key={ar}
                                    onClick={() => setAspectRatio(ar)}
                                    className={`px-2 py-2 rounded border text-xs font-mono transition-colors ${
                                        aspectRatio === ar ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                                    }`}
                                >
                                    {ar}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resolution</label>
                        <div className="flex gap-2">
                             {Object.values(ImageSize).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 py-2 rounded border text-xs font-bold transition-colors ${
                                        size === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                                    }`}
                                >
                                    {s}
                                </button>
                             ))}
                        </div>
                    </div>
                 </>
             ) : (
                 <div className="mb-6">
                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Source Image</label>
                     <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition-colors relative">
                         <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         {uploadedImage ? (
                             <img src={uploadedImage} alt="Upload" className="max-h-32 mx-auto rounded-lg" />
                         ) : (
                             <div className="text-slate-500 flex flex-col items-center">
                                 <ImageIcon className="mb-2" />
                                 <span className="text-sm">Click to upload</span>
                             </div>
                         )}
                     </div>
                 </div>
             )}

             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Prompt</label>
             <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tab === 'create' ? "A futuristic city with flying cars..." : "Add a retro filter..."}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white h-32 outline-none focus:border-purple-500 transition-colors resize-none mb-4"
             />

             <button
                onClick={tab === 'create' ? handleCreate : handleEdit}
                disabled={loading || !prompt || (tab === 'edit' && !uploadedImage)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-purple-900/50"
             >
                {loading ? <RefreshCcw className="animate-spin" /> : (tab === 'create' ? <Sparkles /> : <Wand2 />)}
                {tab === 'create' ? 'Generate Image' : 'Edit Image'}
             </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
            {result ? (
                <div className="relative group">
                    <img src={result} alt="Generated" className="max-w-full max-h-[80vh] rounded shadow-2xl" />
                    <a href={result} download={`gmw11-${Date.now()}.png`} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={20} />
                    </a>
                </div>
            ) : (
                <div className="text-slate-600 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p>Your creation will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;