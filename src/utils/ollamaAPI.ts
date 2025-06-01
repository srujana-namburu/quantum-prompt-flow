
export interface OllamaRequest {
  prompt: string;
  mode: 'writer' | 'rephraser' | 'explainer' | 'search';
}

export interface OllamaResponse {
  response: string;
}

const prompts = {
  writer: (prompt: string) => `Write a blog post or tweet about: ${prompt}`,
  rephraser: (prompt: string) => `Rephrase the following in 3 styles: CEO, teenager, and comedian:\n\n${prompt}`,
  explainer: (prompt: string) => `Explain this simply like I'm 5:\n\n${prompt}`,
  search: (prompt: string) => `Answer this as if referring to your internal documents:\n\n${prompt}`
};

export async function callOllama({ prompt, mode }: OllamaRequest): Promise<OllamaResponse> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: prompts[mode](prompt),
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { response: data.response };
  } catch (error) {
    console.error('Ollama API call failed:', error);
    throw new Error('Failed to connect to Ollama. Make sure it\'s running on localhost:11434');
  }
}
