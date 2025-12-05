

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import LiveVoice from './components/LiveVoice';
import ImageStudio from './components/ImageStudio';
import VeoVideo from './components/VeoVideo';
import Analyzer from './components/Analyzer';
import TTS from './components/TTS';
import Singularity from './components/Singularity';
import AiForge from './components/AiForge';
import CampaignManager from './components/CampaignManager';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return <Chat />;
      case AppMode.LIVE:
        return <LiveVoice />;
      case AppMode.GENERATE_IMAGE:
        return <ImageStudio />;
      case AppMode.GENERATE_VIDEO:
        return <VeoVideo />;
      case AppMode.ANALYZE:
        return <Analyzer />;
      case AppMode.TTS:
        return <TTS />;
      case AppMode.SINGULARITY:
        return <Singularity />;
      case AppMode.AI_FORGE:
        return <AiForge />;
      case AppMode.CAMPAIGN_MANAGER:
        return <CampaignManager />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-inter overflow-hidden">
      <Sidebar currentMode={mode} setMode={setMode} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;