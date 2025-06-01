
import { useState } from 'react';
import { X, Download, Trash, Settings, Monitor, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AIModel, AISettings, SystemStatus } from '@/types/ai';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  models: AIModel[];
  settings: AISettings;
  systemStatus: SystemStatus;
  onUpdateSettings: (settings: Partial<AISettings>) => void;
  onDownloadModel: (modelId: string) => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  models,
  settings,
  systemStatus,
  onUpdateSettings,
  onDownloadModel,
}: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'models' | 'parameters' | 'system'>('models');

  if (!isOpen) return null;

  const availableModels = models.filter(m => m.status === 'available');
  const downloadingModels = models.filter(m => m.status === 'downloading');
  const notInstalledModels = models.filter(m => m.status === 'not_installed');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'models', label: 'Models', icon: Zap },
              { id: 'parameters', label: 'Parameters', icon: Settings },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'models' && (
              <div className="space-y-6">
                {/* Current Model */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Active Model
                  </label>
                  <Select
                    value={settings.selectedModel}
                    onValueChange={(value) => onUpdateSettings({ selectedModel: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{model.size}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Models */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Available Models</h3>
                  <div className="space-y-3">
                    {availableModels.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <div className="font-medium text-white">{model.name}</div>
                          <div className="text-xs text-gray-400">{model.size}</div>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downloading Models */}
                {downloadingModels.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Downloading</h3>
                    <div className="space-y-3">
                      {downloadingModels.map((model) => (
                        <div
                          key={model.id}
                          className="p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{model.name}</div>
                            <div className="text-xs text-gray-400">{model.downloadProgress}%</div>
                          </div>
                          <Progress value={model.downloadProgress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available to Download */}
                {notInstalledModels.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Available to Download</h3>
                    <div className="space-y-3">
                      {notInstalledModels.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div>
                            <div className="font-medium text-white">{model.name}</div>
                            <div className="text-xs text-gray-400">{model.size}</div>
                          </div>
                          <Button
                            onClick={() => onDownloadModel(model.id)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Install
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'parameters' && (
              <div className="space-y-6">
                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white">Temperature</label>
                    <span className="text-sm text-gray-400">{settings.temperature}</span>
                  </div>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={(value) => onUpdateSettings({ temperature: value[0] })}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-400">
                    Controls randomness: 0 is deterministic, 2 is very random
                  </p>
                </div>

                {/* Top P */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white">Top P</label>
                    <span className="text-sm text-gray-400">{settings.topP}</span>
                  </div>
                  <Slider
                    value={[settings.topP]}
                    onValueChange={(value) => onUpdateSettings({ topP: value[0] })}
                    max={1}
                    min={0}
                    step={0.05}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-400">
                    Nucleus sampling: lower values focus on more likely tokens
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white">Max Tokens</label>
                    <span className="text-sm text-gray-400">{settings.maxTokens}</span>
                  </div>
                  <Slider
                    value={[settings.maxTokens]}
                    onValueChange={(value) => onUpdateSettings({ maxTokens: value[0] })}
                    max={4096}
                    min={100}
                    step={100}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-400">
                    Maximum length of the generated response
                  </p>
                </div>

                {/* Stream Response */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Stream Response</label>
                    <p className="text-xs text-gray-400">Show response as it's being generated</p>
                  </div>
                  <Switch
                    checked={settings.streamResponse}
                    onCheckedChange={(checked) => onUpdateSettings({ streamResponse: checked })}
                  />
                </div>

                {/* Save History */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Save History</label>
                    <p className="text-xs text-gray-400">Keep conversation history locally</p>
                  </div>
                  <Switch
                    checked={settings.saveHistory}
                    onCheckedChange={(checked) => onUpdateSettings({ saveHistory: checked })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* System Status */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">System Status</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Memory Usage</span>
                        <span className="text-sm text-gray-400">{systemStatus.memoryUsage}%</span>
                      </div>
                      <Progress value={systemStatus.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">CPU Usage</span>
                        <span className="text-sm text-gray-400">{systemStatus.cpuUsage}%</span>
                      </div>
                      <Progress value={systemStatus.cpuUsage} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Models Loaded</span>
                      <span className="text-sm text-green-400">{systemStatus.modelsLoaded}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Connection Status</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${systemStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-sm text-gray-400">
                          {systemStatus.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      Clear All Conversations
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      Export Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
