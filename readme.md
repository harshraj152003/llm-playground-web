# OpenRouter AI Chat Interface

A lightweight, high-performance web interface for interacting with Large Language Models (LLMs) powered by OpenRouter and OpenAI-compatible APIs. Built with a clean, modern aesthetic and responsive design, this application allows you to connect your API key, select models, adjust generation parameters, and chat with real-time markdown and code rendering.

---

## Key Features

- **Multi-Model Support:** Connect seamlessly to any OpenRouter model, including Llama 3, Gemma, Claude, GPT-4o, and Qwen.
- **Quick Presets:** Easily switch between popular free and paid LLM model slugs with one click.
- **Rich Markdown & Syntax Highlighting:** Renders complex markdown formatting, mathematical expressions, tables, and highlighted code snippets with a built-in copy button.
- **Client-Side Security:** API keys and user preferences are saved strictly in your browser's `localStorage`—no backend required, and your credentials are never exposed.
- **Custom System Prompts:** Set system instructions and tune temperature parameters to customize model outputs.
- **Chat Management:** Organize your conversations with multi-session chat histories, clear history options, and individual message actions.

---

## Tech Stack

- **Frontend:** HTML5, Tailwind CSS
- **Icons:** Lucide Icons
- **Markdown Parsing:** `marked.js`
- **Syntax Highlighting:** `highlight.js`
- **API Integration:** Fetch API (OpenRouter / OpenAI Chat Completions Endpoint)

---

## Quick Start

1. **Clone or Download the Repository:**
   ```bash
   git clone [https://github.com/harshraj152003/llm-playground-web.git](https://github.com/harshraj152003/llm-playground-web.git)
   cd llm-playground-web
   ```

---

```bash
Run Locally:
-- Simply open index.html in your favorite web browser (or use VS Code's Live Server extension).
```

**Configure API Key**:

- Get an API key from OpenRouter.ai.
- Click API & App Settings in the application sidebar.
- Paste your API key (sk-or-v1-...) and start chatting!
