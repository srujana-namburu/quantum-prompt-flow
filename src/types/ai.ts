
export interface AIModel {
  id: string;
  name: string;
  size: string;
  status: 'available' | 'downloading' | 'not_installed';
  downloadProgress?: number;
  parameters?: {
    temperature: number;
    topP: number;
    maxTokens: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  mode: AIMode;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
}

export type AIMode = 'writer' | 'rephraser' | 'explainer' | 'search';

export interface AISettings {
  selectedModel: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  streamResponse: boolean;
  saveHistory: boolean;
}

export interface SystemStatus {
  modelsLoaded: number;
  memoryUsage: number;
  cpuUsage: number;
  isOnline: boolean;
}
