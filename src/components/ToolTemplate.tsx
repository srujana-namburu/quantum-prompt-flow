
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { callOllama } from '@/utils/ollamaAPI';

interface ToolTemplateProps {
  mode: 'writer' | 'rephraser' | 'explainer' | 'search';
  placeholder: string;
}

export default function ToolTemplate({ mode, placeholder }: ToolTemplateProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    
    try {
      const result = await callOllama({ prompt: input, mode });
      setOutput(result.response);
    } catch (error) {
      console.error('Error generating response:', error);
      setOutput('Error: Failed to generate response. Make sure Ollama is running on localhost:11434 with the llama2 model installed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Textarea
        className="min-h-[120px] focus-ring bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? 'Generating...' : 'Generate'}
      </Button>
      {output && (
        <div className="flex-1 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 overflow-auto">
          <h3 className="font-semibold mb-2 text-white">Output:</h3>
          <pre className="whitespace-pre-wrap text-gray-200 text-sm">{output}</pre>
        </div>
      )}
    </div>
  );
}
