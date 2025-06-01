
import { useState } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatusBar } from '@/components/StatusBar';
import { useAI } from '@/hooks/useAI';
import { AIMode } from '@/types/ai';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AIMode>('writer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    models,
    conversations,
    currentConversation,
    settings,
    systemStatus,
    isGenerating,
    generateResponse,
    createConversation,
    addMessage,
    downloadModel,
    updateSettings,
    exportConversation,
  } = useAI();

  const handleModeChange = (mode: AIMode) => {
    setCurrentMode(mode);
    if (!currentConversation || currentConversation.mode !== mode) {
      createConversation(mode);
    }
  };

  const handleSendMessage = async (content: string) => {
    let conversation = currentConversation;
    if (!conversation || conversation.mode !== currentMode) {
      conversation = createConversation(currentMode);
    }

    // Add user message
    addMessage(conversation.id, {
      role: 'user',
      content,
    });

    try {
      // Generate AI response
      const response = await generateResponse(content, currentMode);
      
      // Add AI response
      addMessage(conversation.id, {
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage(conversation.id, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
      });
    }
  };

  const handleExport = (format: 'json' | 'txt' | 'csv') => {
    if (currentConversation) {
      exportConversation(currentConversation.id, format);
    }
  };

  const messages = currentConversation?.messages || [];

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
        <Header
          currentMode={currentMode}
          onModeChange={handleModeChange}
          onSettingsClick={() => setIsSettingsOpen(true)}
          systemStatus={systemStatus}
        />

        {/* Main Content */}
        <div className="flex-1 pt-20 pb-16">
          <div className="container mx-auto h-full max-w-5xl">
            <div className="h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <ChatInterface
                mode={currentMode}
                messages={messages}
                isGenerating={isGenerating}
                onSendMessage={handleSendMessage}
                onExport={handleExport}
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          systemStatus={systemStatus}
          selectedModel={settings.selectedModel}
          isGenerating={isGenerating}
        />
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        models={models}
        settings={settings}
        systemStatus={systemStatus}
        onUpdateSettings={updateSettings}
        onDownloadModel={downloadModel}
      />
    </div>
  );
};

export default Index;
