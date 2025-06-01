
import { useState } from 'react';
import { Settings, Zap, Activity } from 'lucide-react';
import { AIMode } from '@/types/ai';

interface HeaderProps {
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
  onSettingsClick: () => void;
  systemStatus: { isOnline: boolean; modelsLoaded: number };
}

const modes = [
  { id: 'writer' as AIMode, label: 'Writer', icon: '✍️', description: 'Creative writing assistant' },
  { id: 'rephraser' as AIMode, label: 'Rephraser', icon: '🔄', description: 'Improve and rework text' },
  { id: 'explainer' as AIMode, label: 'Explainer', icon: '💡', description: 'Simplify complex topics' },
  { id: 'search' as AIMode, label: 'Search', icon: '🔍', description: 'AI-powered search & analysis' },
];

export const Header = ({ currentMode, onModeChange, onSettingsClick, systemStatus }: HeaderProps) => {
  const [hoveredMode, setHoveredMode] = useState<AIMode | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                AI Multi-Tool
              </h1>
              <p className="text-xs text-gray-400">Powered by Local LLM</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-2xl p-2 backdrop-blur-sm">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                className={`
                  relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                  ${currentMode === mode.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{mode.icon}</span>
                  <span className="text-sm">{mode.label}</span>
                </div>
                
                {(hoveredMode === mode.id || currentMode === mode.id) && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-xs text-white rounded-lg whitespace-nowrap z-10">
                    {mode.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Status & Settings */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Activity className="w-4 h-4" />
              <span>{systemStatus.modelsLoaded} models</span>
              <div className={`w-2 h-2 rounded-full ${systemStatus.isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            </div>

            {/* Settings Button */}
            <button
              onClick={onSettingsClick}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 group"
            >
              <Settings className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
