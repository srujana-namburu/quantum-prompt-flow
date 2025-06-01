
import { Activity, HardDrive, Cpu, Wifi, WifiOff } from 'lucide-react';
import { SystemStatus } from '@/types/ai';

interface StatusBarProps {
  systemStatus: SystemStatus;
  selectedModel: string;
  isGenerating: boolean;
}

export const StatusBar = ({ systemStatus, selectedModel, isGenerating }: StatusBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 py-3">
      <div className="flex items-center justify-between text-xs">
        {/* Left Side - Model & Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-gray-300">
              {isGenerating ? 'Generating...' : 'Ready'}
            </span>
          </div>
          
          <div className="text-gray-400">
            Model: <span className="text-white">{selectedModel}</span>
          </div>
        </div>

        {/* Center - System Metrics */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">CPU:</span>
            <span className={`${systemStatus.cpuUsage > 80 ? 'text-red-400' : 'text-green-400'}`}>
              {systemStatus.cpuUsage}%
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <HardDrive className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Memory:</span>
            <span className={`${systemStatus.memoryUsage > 80 ? 'text-red-400' : 'text-green-400'}`}>
              {systemStatus.memoryUsage}%
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Models:</span>
            <span className="text-green-400">{systemStatus.modelsLoaded}</span>
          </div>
        </div>

        {/* Right Side - Connection Status */}
        <div className="flex items-center space-x-2">
          {systemStatus.isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={systemStatus.isOnline ? 'text-green-400' : 'text-red-400'}>
            {systemStatus.isOnline ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};
