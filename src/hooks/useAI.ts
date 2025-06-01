
import { useState, useEffect, useCallback } from 'react';
import { AIModel, Conversation, Message, AIMode, AISettings, SystemStatus } from '@/types/ai';

// Mock data for demonstration - in production this would connect to actual LLM APIs
const mockModels: AIModel[] = [
  { id: 'llama2-7b', name: 'Llama 2 7B', size: '3.8GB', status: 'available' },
  { id: 'codellama-13b', name: 'Code Llama 13B', size: '7.4GB', status: 'available' },
  { id: 'mistral-7b', name: 'Mistral 7B', size: '4.1GB', status: 'not_installed' },
  { id: 'neural-chat-7b', name: 'Neural Chat 7B', size: '4.8GB', status: 'downloading', downloadProgress: 65 },
];

export const useAI = () => {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [settings, setSettings] = useState<AISettings>({
    selectedModel: 'llama2-7b',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    streamResponse: true,
    saveHistory: true,
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    modelsLoaded: 2,
    memoryUsage: 45,
    cpuUsage: 23,
    isOnline: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = useCallback(async (
    prompt: string, 
    mode: AIMode, 
    onToken?: (token: string) => void
  ): Promise<string> => {
    setIsGenerating(true);
    
    // Simulate streaming response
    const responses = {
      writer: "I'll help you craft compelling content. Here's a well-structured piece based on your request...",
      rephraser: "Here's your content rephrased with improved clarity and flow...",
      explainer: "Let me break this down into clear, understandable terms...",
      search: "Based on the available information, here's what I found..."
    };

    const response = responses[mode] + " " + prompt.slice(0, 50) + "...";
    
    if (settings.streamResponse && onToken) {
      for (let i = 0; i < response.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        onToken(response.slice(0, i + 1));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsGenerating(false);
    return response;
  }, [settings.streamResponse]);

  const createConversation = useCallback((mode: AIMode): Conversation => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New ${mode} conversation`,
      mode,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation;
  }, []);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, messages: [...conv.messages, newMessage], updatedAt: new Date() }
        : conv
    ));

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      } : null);
    }
  }, [currentConversation]);

  const downloadModel = useCallback(async (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'downloading', downloadProgress: 0 }
        : model
    ));

    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, downloadProgress: progress }
          : model
      ));
    }

    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'available', downloadProgress: undefined }
        : model
    ));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const exportConversation = useCallback((conversationId: string, format: 'json' | 'txt' | 'csv') => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    let content = '';
    switch (format) {
      case 'json':
        content = JSON.stringify(conversation, null, 2);
        break;
      case 'txt':
        content = conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
        break;
      case 'csv':
        content = 'Role,Content,Timestamp\n' + 
          conversation.messages.map(m => `${m.role},"${m.content}","${m.timestamp}"`).join('\n');
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conversations]);

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        memoryUsage: Math.max(30, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 20)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
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
    setCurrentConversation,
  };
};
