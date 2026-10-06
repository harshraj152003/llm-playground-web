// System & State Management
const defaultState = {
  apiKey: "",
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.1-8b-instruct",
  temperature: 0.7,
  systemPrompt: "You are a helpful, smart, and concise AI assistant.",
  messages: [],
};

let state = { ...defaultState };

// DOM Elements
const apiKeyInput = document.getElementById("apiKeyInput");
const endpointInput = document.getElementById("endpointInput");
const modelInput = document.getElementById("modelInput");
const presetSelect = document.getElementById("presetSelect");
const tempInput = document.getElementById("tempInput");
const tempValue = document.getElementById("tempValue");
const systemPromptInput = document.getElementById("systemPromptInput");
const saveConfigBtn = document.getElementById("saveConfigBtn");

const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const emptyState = document.getElementById("emptyState");
const clearChatBtn = document.getElementById("clearChatBtn");

const currentModelDisplay = document.getElementById("currentModelDisplay");
const endpointHostDisplay = document.getElementById("endpointHostDisplay");
const statusIndicator = document.getElementById("statusIndicator");

// Toggle Mobile Sidebar
const settingsDrawer = document.getElementById("settingsDrawer");
document
  .getElementById("openSidebarMobile")
  .addEventListener("click", () =>
    settingsDrawer.classList.remove("-translate-x-full"),
  );
document
  .getElementById("toggleSidebarMobile")
  .addEventListener("click", () =>
    settingsDrawer.classList.add("-translate-x-full"),
  );

// Toggle API Key Visibility
document.getElementById("toggleKeyVisibility").addEventListener("click", () => {
  apiKeyInput.type = apiKeyInput.type === "password" ? "text" : "password";
});

// Initialize App
window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadState();
  renderChat();

  // Configure Marked JS
  marked.setOptions({
    highlight: function (code, lang) {
      const language = highlight.getLanguage(lang) ? lang : "plaintext";
      return highlight.highlight(code, { language }).value;
    },
    langPrefix: "hljs language-",
  });
});

// Handle Presets
presetSelect.addEventListener("change", (e) => {
  if (e.target.value) {
    modelInput.value = e.target.value;
  }
});

// Temperature Slider Feedback
tempInput.addEventListener("input", (e) => {
  tempValue.textContent = e.target.value;
});

// Auto-expand Textarea
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 144) + "px";
});

// Save Settings
saveConfigBtn.addEventListener("click", () => {
  state.apiKey = apiKeyInput.value.trim();
  state.endpoint = endpointInput.value.trim();
  state.model = modelInput.value.trim();
  state.temperature = parseFloat(tempInput.value);
  state.systemPrompt = systemPromptInput.value.trim();

  saveState();
  updateHeaderDisplays();

  // Show temporary save toast
  statusIndicator.textContent = "Settings saved!";
  setTimeout(() => (statusIndicator.textContent = "Ready"), 2000);
});

// Save/Load to Local Storage
function saveState() {
  localStorage.setItem(
    "llm_app_state",
    JSON.stringify({
      apiKey: state.apiKey,
      endpoint: state.endpoint,
      model: state.model,
      temperature: state.temperature,
      systemPrompt: state.systemPrompt,
      messages: state.messages,
    }),
  );
}

function loadState() {
  const saved = localStorage.getItem("llm_app_state");
  if (saved) {
    try {
      state = { ...defaultState, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Failed to parse state", e);
    }
  }

  // Populate Inputs
  apiKeyInput.value = state.apiKey || "";
  endpointInput.value = state.endpoint || defaultState.endpoint;
  modelInput.value = state.model || defaultState.model;
  presetSelect.value = state.model || "";
  tempInput.value = state.temperature;
  tempValue.textContent = state.temperature;
  systemPromptInput.value = state.systemPrompt || defaultState.systemPrompt;

  updateHeaderDisplays();
}

function updateHeaderDisplays() {
  currentModelDisplay.textContent = state.model || "No Model Set";
  try {
    const url = new URL(state.endpoint);
    endpointHostDisplay.textContent = url.hostname;
  } catch (e) {
    endpointHostDisplay.textContent = "Custom Endpoint";
  }
}

// Render Chat Messages
function renderChat() {
  if (state.messages.length === 0) {
    emptyState.style.display = "flex";
    chatContainer.innerHTML = "";
    chatContainer.appendChild(emptyState);
    return;
  }

  emptyState.style.display = "none";
  chatContainer.innerHTML = "";

  state.messages.forEach((msg, index) => {
    const msgDiv = createMessageElement(msg.role, msg.content, index);
    chatContainer.appendChild(msgDiv);
  });

  scrollToBottom();
  lucide.createIcons();
}

function createMessageElement(role, content, index) {
  const isUser = role === "user";
  const wrapper = document.createElement("div");
  wrapper.className = `flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`;

  const header = document.createElement("div");
  header.className = `flex items-center gap-2 text-xs text-slate-400 px-1`;
  header.innerHTML = `
        <span class="font-semibold">${isUser ? "You" : "Assistant"}</span>
        <span>•</span>
        <span>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      `;

  const bubble = document.createElement("div");
  bubble.className = `max-w-[85%] rounded-2xl px-4 py-3 text-sm prose ${
    isUser
      ? "bg-indigo-600 text-white rounded-br-none"
      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
  }`;

  if (isUser) {
    bubble.textContent = content;
  } else {
    bubble.innerHTML = marked.parse(content || "...");
  }

  // Actions bar below message
  const actions = document.createElement("div");
  actions.className = `flex items-center gap-2 text-xs text-slate-500 opacity-0 hover:opacity-100 transition px-1`;
  actions.innerHTML = `
        <button onclick="copyMessage(${index})" class="hover:text-slate-300 transition" title="Copy text">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="deleteMessage(${index})" class="hover:text-rose-400 transition" title="Delete message">
          <i data-lucide="trash" class="w-3.5 h-3.5"></i>
        </button>
      `;

  wrapper.appendChild(header);
  wrapper.appendChild(bubble);
  wrapper.appendChild(actions);

  return wrapper;
}

// Helper Actions
window.copyMessage = (index) => {
  const text = state.messages[index].content;
  navigator.clipboard.writeText(text);
  statusIndicator.textContent = "Copied to clipboard!";
  setTimeout(() => (statusIndicator.textContent = "Ready"), 1500);
};

window.deleteMessage = (index) => {
  state.messages.splice(index, 1);
  saveState();
  renderChat();
};

clearChatBtn.addEventListener("click", () => {
  if (confirm("Clear all conversation history?")) {
    state.messages = [];
    saveState();
    renderChat();
  }
});

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send Message Logic
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (!state.apiKey) {
    alert("Please configure your API Key in the settings sidebar first.");
    return;
  }

  // Add User Message
  state.messages.push({ role: "user", content: text });
  userInput.value = "";
  userInput.style.height = "auto";
  renderChat();

  // Add Placeholder Assistant Message
  const assistantMsgIndex = state.messages.length;
  state.messages.push({ role: "assistant", content: "" });
  renderChat();

  statusIndicator.textContent = "Thinking...";
  sendBtn.disabled = true;

  try {
    // Build Payload
    const apiMessages = [
      ...(state.systemPrompt
        ? [{ role: "system", content: state.systemPrompt }]
        : []),
      ...state.messages.slice(0, -1), // Exclude empty assistant placeholder
    ];

    const response = await fetch(state.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.apiKey}`,
        "HTTP-Referer": window.location.href, // Recommended for OpenRouter
        "X-Title": "LLM Playground App",
      },
      body: JSON.stringify({
        model: state.model,
        messages: apiMessages,
        temperature: state.temperature,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.error?.message || `HTTP Error ${response.status}`,
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "No response generated.";

    // Update Assistant Message
    state.messages[assistantMsgIndex].content = reply;
    saveState();
    renderChat();

    statusIndicator.textContent = "Ready";
  } catch (err) {
    console.error(err);
    state.messages[assistantMsgIndex].content = `**Error:** ${err.message}`;
    renderChat();
    statusIndicator.textContent = "Error occurred";
  } finally {
    sendBtn.disabled = false;
  }
}

// Keyboard Shortcuts
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);
