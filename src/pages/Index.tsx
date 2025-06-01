
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParticleBackground } from '@/components/ParticleBackground';
import { StatusBar } from '@/components/StatusBar';
import Writer from '@/components/Writer';
import Rephraser from '@/components/Rephraser';
import Explainer from '@/components/Explainer';
import Search from '@/components/Search';
import { useAI } from '@/hooks/useAI';

const Index = () => {
  const [activeTab, setActiveTab] = useState('writer');
  
  const {
    systemStatus,
    settings,
  } = useAI();

  const modeLabels = {
    writer: '✍️ Writer',
    rephraser: '🔁 Rephraser',
    explainer: '📚 Explainer',
    search: '🔍 Search'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Main Layout */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold gradient-text">🧠 AI Multi-Tool (Local)</h1>
            <p className="text-gray-400 text-sm mt-1">Powered by Ollama & Llama2</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-24 pb-16">
          <div className="container mx-auto h-full max-w-4xl px-6">
            <div className="h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 bg-black/40 border-b border-white/10 rounded-none">
                  <TabsTrigger value="writer" className="text-white data-[state=active]:bg-white/20">
                    {modeLabels.writer}
                  </TabsTrigger>
                  <TabsTrigger value="rephraser" className="text-white data-[state=active]:bg-white/20">
                    {modeLabels.rephraser}
                  </TabsTrigger>
                  <TabsTrigger value="explainer" className="text-white data-[state=active]:bg-white/20">
                    {modeLabels.explainer}
                  </TabsTrigger>
                  <TabsTrigger value="search" className="text-white data-[state=active]:bg-white/20">
                    {modeLabels.search}
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 p-6">
                  <TabsContent value="writer" className="h-full">
                    <Writer />
                  </TabsContent>
                  <TabsContent value="rephraser" className="h-full">
                    <Rephraser />
                  </TabsContent>
                  <TabsContent value="explainer" className="h-full">
                    <Explainer />
                  </TabsContent>
                  <TabsContent value="search" className="h-full">
                    <Search />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          systemStatus={systemStatus}
          selectedModel="llama2"
          isGenerating={false}
        />
      </div>
    </div>
  );
};

export default Index;
