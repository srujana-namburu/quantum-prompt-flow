# 🧠 AI Multi-Tool (Local Ollama + Next.js)

This project is a **Local AI-powered Productivity App** built using **Next.js** and **Ollama** as the backend. It runs entirely on your machine with no cloud dependencies.

## 🚀 App Modes

The following features are included:

1. ✍️ **Writer** – Generate blog posts, tweets, or article ideas from a topic prompt.  
2. 🔁 **Rephraser** – Rephrase input text in 3 fun styles: CEO, Teenager, and Comedian.  
3. 📚 **Explainer** – Simplify complex topics as if explaining to a 5-year-old.  
4. 🔍 **Search (Optional)** – Ask questions as if searching a document or knowledge base.


---

## 🧠 Model Used

- Model: `llama2`
- Host: Local (via Ollama)
- Endpoint: `http://localhost:11434`

Make sure `llama2` is pulled via Ollama before running the app.

---

## 🧰 Setup Instructions

### 1. Install Ollama

> Ollama is required to run the language model locally.

```bash
brew install ollama          # macOS
# OR
winget install Ollama.Ollama # Windows
ollama pull llama2
git clone <your-repo-url>
cd your-repo-name
npm install
ollama run llama2
npm run dev
```
