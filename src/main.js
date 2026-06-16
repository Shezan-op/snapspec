import './style.css';
import { analyzeGoogle } from './providers/google.js';
import { analyzeClaude } from './providers/claude.js';
import { analyzeOpenAI } from './providers/openai.js';
import { analyzeOpenRouter } from './providers/openrouter.js';
import { analyzeOllama } from './providers/ollama.js';

// Global App State
const state = {
  provider: localStorage.getItem('pf_provider') || 'gemini',
  apiKey: localStorage.getItem('pf_api_key') || '',
  cloudModel: localStorage.getItem('pf_cloud_model') || 'google/gemini-2.5-flash',
  customCloudModel: localStorage.getItem('pf_custom_cloud_model') || '',
  ollamaModel: localStorage.getItem('pf_ollama_model') || '',
  ollamaEndpoint: localStorage.getItem('pf_ollama_endpoint') || 'https://ollama.com',
  history: JSON.parse(localStorage.getItem('pf_history') || '[]'),
  currentImage: null, // File
  currentImageBase64: null,
  isAnalyzing: false,
  generatedMarkdown: ''
};

// DOM Elements
const elements = {
  toggleConfigBtn: document.getElementById('toggle-config-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeConfigBtn: document.getElementById('close-config-btn'),
  saveConfigBtn: document.getElementById('save-config-btn'),
  
  providerSelect: document.getElementById('provider-select'),
  apiKeyContainer: document.getElementById('api-key-container'),
  apiKeyInput: document.getElementById('api-key'),
  cloudModelContainer: document.getElementById('cloud-model-container'),
  cloudModelInput: document.getElementById('cloud-model'),
  ollamaModelContainer: document.getElementById('ollama-model-container'),
  ollamaModelInput: document.getElementById('ollama-model'),
  ollamaEndpointInput: document.getElementById('ollama-endpoint'),
  customCloudModelInput: document.getElementById('custom-cloud-model'),
  toggleCustomModelBtn: document.getElementById('toggle-custom-model-btn'),
  showMoreDemosBtn: document.getElementById('show-more-demos-btn'),
  
  openHistoryBtn: document.getElementById('open-history-btn'),
  historySaveModal: document.getElementById('history-save-modal'),
  historySaveName: document.getElementById('history-save-name'),
  btnSaveHistory: document.getElementById('btn-save-history'),
  btnDontSave: document.getElementById('btn-dont-save'),
  btnCancelClear: document.getElementById('btn-cancel-clear'),
  
  historyViewModal: document.getElementById('history-view-modal'),
  historyViewBackdrop: document.getElementById('history-view-backdrop'),
  closeHistoryBtn: document.getElementById('close-history-btn'),
  historyList: document.getElementById('history-list'),
  emptyHistoryMsg: document.getElementById('empty-history-msg'),

  
  uploadZone: document.getElementById('upload-zone'),
  fileInput: document.getElementById('file-input'),
  uploadPromptText: document.getElementById('upload-prompt-text'),
  previewContainer: document.getElementById('preview-container'),
  imagePreview: document.getElementById('image-preview'),
  scannerLine: document.getElementById('scanner-line'),
  generateBtn: document.getElementById('generate-btn'),
  
  resultsPanel: document.getElementById('results-panel'),
  resultsPlaceholder: document.getElementById('results-placeholder'),
  resultsCard: document.getElementById('results-card'),
  
  // Results output elements
  markdownOutputPlaceholder: document.getElementById('markdown-output-placeholder'),
  generationStatusText: document.getElementById('generation-status-text'),
  markdownContainer: document.getElementById('markdown-container'),
  markdownFade: document.getElementById('markdown-fade'),
  showMoreBtn: document.getElementById('show-more-btn'),
  markdownOutput: document.getElementById('markdown-output'),
  clearBtn: document.getElementById('clear-btn'),
  copyMarkdownBtn: document.getElementById('copy-markdown-btn'),
  downloadMarkdownBtn: document.getElementById('download-markdown-btn'),
  markdownOutputError: document.getElementById('markdown-output-error'),
  errorMessageText: document.getElementById('error-message-text'),
  retryGenerationBtn: document.getElementById('retry-generation-btn'),
  
  // Subscribe Modal Elements
  subscribeModal: document.getElementById('subscribe-modal'),
  closeSubscribeBtn: document.getElementById('close-subscribe-btn'),
  subscribeBackdrop: document.getElementById('subscribe-backdrop'),
  
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),
  toastMsgBox: document.querySelector('.toast-msg')
};

// Initialize Application
function init() {
  initClickSpark();
  initCardNav();
  initBorderGlow();
  initFolder();
  initBlurText();
  initScrollReveal();
  initFAQ();
  
  // Handle URL open actions for settings/history redirects
  const params = new URLSearchParams(window.location.search);
  if (params.get('open') === 'settings') {
    setTimeout(() => {
      const settingsModal = document.getElementById('settings-modal');
      if (settingsModal) {
        settingsModal.classList.remove('opacity-0', 'pointer-events-none');
        settingsModal.querySelector('.modal-glass').classList.remove('scale-95');
        settingsModal.querySelector('.modal-glass').classList.add('scale-100');
      }
    }, 300);
  } else if (params.get('open') === 'history') {
    setTimeout(() => {
      const historyViewModal = document.getElementById('history-view-modal');
      if (historyViewModal) {
        renderHistoryList();
        historyViewModal.classList.remove('opacity-0', 'pointer-events-none');
        historyViewModal.querySelector('.modal-glass').classList.remove('scale-95');
        historyViewModal.querySelector('.modal-glass').classList.add('scale-100');
      }
    }, 300);
  }

  if (elements.toggleConfigBtn) {
    setupEventListeners();
    loadSavedSettings();
  }
}

const cloudPresets = [
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3.7-sonnet',
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'openrouter/free'
];

// Load Settings from state to UI
function loadSavedSettings() {
  if (!elements.providerSelect) return;
  elements.providerSelect.value = state.provider;
  elements.apiKeyInput.value = state.apiKey;

  if (cloudPresets.includes(state.cloudModel)) {
    elements.cloudModelInput.value = state.cloudModel;
    elements.customCloudModelInput.value = '';
    elements.cloudModelInput.classList.remove('hidden');
    elements.customCloudModelInput.classList.add('hidden');
    if (elements.toggleCustomModelBtn) {
      elements.toggleCustomModelBtn.textContent = 'Use Custom Model';
    }
  } else {
    elements.cloudModelInput.value = 'google/gemini-2.5-flash';
    elements.customCloudModelInput.value = state.cloudModel;
    elements.cloudModelInput.classList.add('hidden');
    elements.customCloudModelInput.classList.remove('hidden');
    if (elements.toggleCustomModelBtn) {
      elements.toggleCustomModelBtn.textContent = 'Use Preset Model';
    }
  }
  elements.ollamaModelInput.value = state.ollamaModel;
  if (elements.ollamaEndpointInput) elements.ollamaEndpointInput.value = state.ollamaEndpoint;

  updateSettingsUI();
}

function updateSettingsUI() {
  const provider = elements.providerSelect.value;
  if (provider === 'ollama') {
    elements.apiKeyContainer.classList.remove('hidden');
    elements.cloudModelContainer.classList.add('hidden');
    elements.ollamaModelContainer.classList.remove('hidden');
  } else if (provider === 'gemini') {
    elements.apiKeyContainer.classList.remove('hidden');
    elements.cloudModelContainer.classList.add('hidden');
    elements.ollamaModelContainer.classList.add('hidden');
  } else {
    elements.apiKeyContainer.classList.remove('hidden');
    elements.cloudModelContainer.classList.remove('hidden');
    elements.ollamaModelContainer.classList.add('hidden');
  }
}


// Event Listeners Setup
function setupEventListeners() {
  // Settings Modal
  elements.toggleConfigBtn.addEventListener('click', () => {
    elements.settingsModal.classList.remove('opacity-0', 'pointer-events-none');
    elements.settingsModal.querySelector('.modal-glass').classList.remove('scale-95');
    elements.settingsModal.querySelector('.modal-glass').classList.add('scale-100');
  });

  const closeModal = () => {
    elements.settingsModal.classList.add('opacity-0', 'pointer-events-none');
    elements.settingsModal.querySelector('.modal-glass').classList.remove('scale-100');
    elements.settingsModal.querySelector('.modal-glass').classList.add('scale-95');
  };

  elements.closeConfigBtn.addEventListener('click', closeModal);
  elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) closeModal();
  });

  elements.providerSelect.addEventListener('change', updateSettingsUI);

  elements.toggleCustomModelBtn?.addEventListener('click', () => {
    const isCustomInputHidden = elements.customCloudModelInput.classList.contains('hidden');
    if (isCustomInputHidden) {
      elements.customCloudModelInput.classList.remove('hidden');
      elements.cloudModelInput.classList.add('hidden');
      elements.toggleCustomModelBtn.textContent = 'Use Preset Model';
    } else {
      elements.customCloudModelInput.classList.add('hidden');
      elements.cloudModelInput.classList.remove('hidden');
      elements.toggleCustomModelBtn.textContent = 'Use Custom Model';
    }
  });

  elements.saveConfigBtn.addEventListener('click', () => {
    state.provider = elements.providerSelect.value;
    state.apiKey = elements.apiKeyInput.value.trim();

    const isCustomModelActive = !elements.customCloudModelInput.classList.contains('hidden');
    if (isCustomModelActive) {
      state.cloudModel = elements.customCloudModelInput.value.trim() || 'google/gemini-2.5-flash';
    } else {
      state.cloudModel = elements.cloudModelInput.value.trim() || 'google/gemini-2.5-flash';
    }

    state.ollamaModel = elements.ollamaModelInput.value.trim();
    state.ollamaEndpoint = (elements.ollamaEndpointInput ? elements.ollamaEndpointInput.value.trim() : '') || 'https://ollama.com';
    
    localStorage.setItem('pf_provider', state.provider);
    localStorage.setItem('pf_api_key', state.apiKey);
    localStorage.setItem('pf_cloud_model', state.cloudModel);
    localStorage.setItem('pf_custom_cloud_model', elements.customCloudModelInput.value.trim());
    localStorage.setItem('pf_ollama_model', state.ollamaModel);
    localStorage.setItem('pf_ollama_endpoint', state.ollamaEndpoint);
    
    closeModal();
    showToast('Settings saved successfully');
  });

  // Drag and drop handlers
  elements.uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.uploadZone.style.borderColor = 'var(--color-primary)';
  });

  elements.uploadZone.addEventListener('dragleave', () => {
    elements.uploadZone.style.borderColor = '';
  });

  elements.uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.uploadZone.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  });

  elements.uploadZone.addEventListener('click', () => {
    elements.fileInput.click();
  });

  elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleImageUpload(e.target.files[0]);
    }
  });

  // Action buttons
  elements.generateBtn.addEventListener('click', () => {
    if (state.currentImageBase64) {
      analyzeImage(state.currentImageBase64);
    } else {
      showToast('Please upload an image first.');
    }
  });

  elements.retryGenerationBtn?.addEventListener('click', () => {
    if (state.currentImageBase64) {
      analyzeImage(state.currentImageBase64);
    }
  });


  elements.cloudModelInput.addEventListener('change', updateSettingsUI);



  // History Save Intercept
  elements.clearBtn.addEventListener('click', () => {
    if (!state.generatedMarkdown) return;
    elements.historySaveModal.classList.remove('opacity-0', 'pointer-events-none');
    elements.historySaveModal.querySelector('.modal-glass').classList.remove('scale-95');
    elements.historySaveModal.querySelector('.modal-glass').classList.add('scale-100');
    elements.historySaveName.value = '';
    elements.historySaveName.focus();
  });
  
  const closeSaveHistoryModal = () => {
    elements.historySaveModal.classList.add('opacity-0', 'pointer-events-none');
    elements.historySaveModal.querySelector('.modal-glass').classList.remove('scale-100');
    elements.historySaveModal.querySelector('.modal-glass').classList.add('scale-95');
  };

  elements.btnSaveHistory.addEventListener('click', () => {
    const name = elements.historySaveName.value.trim() || 'Untitled Design';
    saveToHistory(name, state.generatedMarkdown);
    closeSaveHistoryModal();
    forceClearImage();
    showToast('Saved to history');
  });

  elements.btnDontSave.addEventListener('click', () => {
    closeSaveHistoryModal();
    forceClearImage();
  });

  elements.btnCancelClear.addEventListener('click', closeSaveHistoryModal);

  // History View Modal
  const openHistoryView = (e) => {
    e.preventDefault();
    renderHistoryList();
    elements.historyViewModal.classList.remove('opacity-0', 'pointer-events-none');
    elements.historyViewModal.querySelector('.modal-glass').classList.remove('scale-95');
    elements.historyViewModal.querySelector('.modal-glass').classList.add('scale-100');
  };
  
  elements.openHistoryBtn.addEventListener('click', openHistoryView);
  
  const closeHistoryView = () => {
    elements.historyViewModal.classList.add('opacity-0', 'pointer-events-none');
    elements.historyViewModal.querySelector('.modal-glass').classList.remove('scale-100');
    elements.historyViewModal.querySelector('.modal-glass').classList.add('scale-95');
  };
  
  elements.closeHistoryBtn.addEventListener('click', closeHistoryView);
  elements.historyViewBackdrop.addEventListener('click', closeHistoryView);

  
  if (elements.copyMarkdownBtn) {
    elements.copyMarkdownBtn.addEventListener('click', () => {
      copyToClipboard(state.generatedMarkdown, 'Markdown copied to clipboard!');
      openSubscribeModal();
    });
  }
  
  if (elements.downloadMarkdownBtn) {
    elements.downloadMarkdownBtn.addEventListener('click', () => {
      downloadMarkdownFile();
      openSubscribeModal();
    });
  }

  // Subscribe Modal Logic
  const openSubscribeModal = () => {
    if(!elements.subscribeModal) return;
    elements.subscribeModal.classList.remove('opacity-0', 'pointer-events-none');
    elements.subscribeModal.querySelector('.modal-glass').classList.remove('scale-95');
    elements.subscribeModal.querySelector('.modal-glass').classList.add('scale-100');
  };
  const closeSubscribeModal = () => {
    if(!elements.subscribeModal) return;
    elements.subscribeModal.classList.add('opacity-0', 'pointer-events-none');
    elements.subscribeModal.querySelector('.modal-glass').classList.remove('scale-100');
    elements.subscribeModal.querySelector('.modal-glass').classList.add('scale-95');
  };
  
  if(elements.closeSubscribeBtn) elements.closeSubscribeBtn.addEventListener('click', closeSubscribeModal);
  if(elements.subscribeBackdrop) elements.subscribeBackdrop.addEventListener('click', closeSubscribeModal);

  // Show More Logic
  if(elements.showMoreBtn && elements.markdownContainer) {
    elements.showMoreBtn.addEventListener('click', () => {
      const isExpanded = elements.markdownContainer.classList.contains('max-h-[400px]');
      if (isExpanded) {
        elements.markdownContainer.classList.remove('max-h-[400px]');
        elements.markdownContainer.classList.add('max-h-[none]');
        elements.markdownFade.classList.add('hidden');
        elements.showMoreBtn.textContent = 'Show Less';
      } else {
        elements.markdownContainer.classList.add('max-h-[400px]');
        elements.markdownContainer.classList.remove('max-h-[none]');
        elements.markdownFade.classList.remove('hidden');
        elements.showMoreBtn.textContent = 'Show More';
        elements.markdownContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Show More Demos Logic
  if (elements.showMoreDemosBtn) {
    elements.showMoreDemosBtn.addEventListener('click', () => {
      const hiddenRows = document.querySelectorAll('.hidden-demo-row');
      const isExpanded = elements.showMoreDemosBtn.textContent.includes('Less');
      
      if (isExpanded) {
        hiddenRows.forEach(row => row.classList.add('hidden'));
        elements.showMoreDemosBtn.textContent = 'Show More Demos';
      } else {
        hiddenRows.forEach(row => row.classList.remove('hidden'));
        elements.showMoreDemosBtn.textContent = 'Show Less Demos';
      }
    });
  }
}

// Clean upload zone / reset state
function forceClearImage() {
  state.currentImage = null;
  state.currentImageBase64 = null;
  state.generatedMarkdown = '';
  elements.fileInput.value = '';
  elements.imagePreview.src = '';
  
  elements.previewContainer.classList.add('hidden');
  elements.previewContainer.classList.remove('flex');
  elements.uploadPromptText.classList.remove('hidden');
  elements.generateBtn.classList.add('hidden');
  
  // Hide results panel data
  elements.resultsCard.classList.add('hidden');
  elements.resultsCard.classList.remove('flex');
  if (elements.resultsPlaceholder) elements.resultsPlaceholder.classList.remove('hidden');
  if (elements.resultsPanel) elements.resultsPanel.classList.add('hidden');
  elements.markdownOutput.textContent = '';
  
  if(elements.showMoreBtn) elements.showMoreBtn.classList.add('hidden');
  if(elements.markdownFade) elements.markdownFade.classList.add('hidden');
}

// Handle uploaded image file
function handleImageUpload(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Invalid file format. Please upload an image.');
    return;
  }

  state.currentImage = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    elements.uploadPromptText.classList.add('hidden');
    elements.previewContainer.classList.remove('hidden');
    elements.previewContainer.classList.add('flex');
    elements.imagePreview.src = e.target.result;
    
    state.currentImageBase64 = e.target.result;
    elements.generateBtn.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

// Master System Prompt for DESIGN.md Extraction
const SYSTEM_PROMPT = `You are a senior visual design analyst, brand system reverse-engineer, and design-spec author.

Your job is to inspect a single homepage screenshot, infer the underlying design language, and generate a highly structured DESIGN.md document that describes the system as if it were hand-authored by a design team.

You do not write a casual summary. You write a design-language extraction document.

PRIMARY GOAL
Convert one homepage screenshot into a clean, highly detailed, brand-specific DESIGN.md file that captures:
1. Visual philosophy
2. Brand atmosphere
3. Color system
4. Typography system
5. Spacing rhythm
6. Layout structure
7. Component grammar
8. Elevation and depth
9. Responsive behavior
10. Negative rules
11. Iteration notes
12. Known gaps or uncertain areas

CORE BEHAVIOR
- Act like a hybrid of design strategist, UI analyst, systems thinker, and documentation writer.
- Always extract the visual system, not just the content.
- Always infer the brand's intent from the screenshot.
- Always explain the logic behind the observed visual decisions.
- Always write with clarity, precision, and structure.
- Always prefer grounded inference over guesswork.
- Never hallucinate details that are not supported by the screenshot.
- Never invent exact brand tokens unless the visual evidence is strong.
- When uncertain, mark the detail as probable, likely, or inferred.
- When a detail is not observable, write "not confirmed from screenshot".
- Never sound generic. Every output must feel brand-specific.

INPUT YOU WILL RECEIVE
- One full homepage screenshot.
- Optional context such as brand name, page type, or notes.
- No direct design system file.

WHAT YOU MUST LOOK FOR
1. Dominant palette
   - Primary accent color
   - Surface colors
   - Background philosophy
   - Neutral ladder
   - Text color hierarchy
   - Whether the system uses one color, multiple colors, gradients, or monochrome

2. Typography behavior
   - Likely font family mood
   - Headline personality
   - Body text density
   - Whether type is rounded, humanist, geometric, serif, mono, corporate, editorial, or technical
   - Weight strategy
   - Letter spacing tendencies
   - Line-height feel
   - Capitalization behavior
   - Whether code or monospace appears

3. Layout structure
   - Is the page a long scroll or a tight hero-led layout?
   - Is it centered, full-bleed, tiled, split, stacked, or modular?
   - Does the page use a narrow reading column, wide marketing canvas, or product-grid structure?
   - How much whitespace exists?
   - Are sections separated by color change, spacing, borders, gradients, or image panels?

4. Component grammar
   - Buttons
   - Nav bars
   - Cards
   - Chips
   - Inputs
   - Tables
   - Pricing blocks
   - Hero modules
   - Product mockups
   - Sticky bars
   - Footer patterns
   - Any recurring UI primitives

5. Depth and elevation
   - Flat
   - Hairline borders
   - Soft shadows
   - Layered shadows
   - Blur
   - Product-only elevation
   - Full-bleed tile alternation
   - Floating elements

6. Visual identity
   - Is the brand calm, premium, technical, playful, warm, brutal, minimal, corporate, or futuristic?
   - Is the UI loud or quiet?
   - Does the product or the brand do the talking?
   - Is the page documentation-first, photography-first, product-first, or marketing-first?

7. Motion and interaction clues
   - Press states
   - Hover style
   - Focus style
   - Sticky behavior
   - Floating CTA behavior
   - Animated or static feeling
   - Any sign of scale, blur, or transition logic

8. Missing or hidden logic
   - If something is not visible, do not invent it
   - Infer cautiously only when the visual evidence supports it
   - Mention likely gaps in the screenshot-based reconstruction
   - Separate visible facts from inferred assumptions

WHAT TO COVER UP
You must NOT:
- Overfit to irrelevant screenshot noise
- Invent pixel-perfect values without evidence
- Invent exact font family names when the screenshot does not justify them
- Pretend you know shadow values, motion values, or breakpoints unless they are visible or strongly implied
- Describe content that is not visible
- Turn a homepage screenshot into a full company history
- Add marketing fluff
- Use vague language like "modern and sleek" without specifics
- Use generic design-system language without brand anchoring

OUTPUT FORMAT
Return one single markdown document in this structure:

---
version: alpha
name: [BrandName]-Inspired-design-analysis
description: [2 to 4 sentence brand-language summary]
---

## Overview
Write a strong narrative summary of the homepage's visual philosophy.
Explain what the page feels like, how it is built, and what the brand is trying to communicate.

## Key Characteristics
Give 5 to 10 bullet points that capture the system at a glance.
Each bullet should be concrete and specific.

## Colors
Explain the color system in detail.
Include:
- Primary / accent colors
- Surface colors
- Text colors
- Neutral ladder
- Semantic colors if visible
- Gradient logic if visible
- Color role hierarchy

If exact hex values are not confidently known, use:
- likely
- probable
- inferred
- visually closest match

## Typography
Explain:
- Font family mood
- Display hierarchy
- Body hierarchy
- Letter spacing
- Weight usage
- Capitalization
- Monospace usage if visible
- Fallback logic if the exact font is not identifiable

## Layout
Explain:
- Container width
- Grid logic
- Section rhythm
- Whitespace strategy
- Hero composition
- Card grid behavior
- Split sections
- Full-bleed behavior
- Alignment rules

## Elevation & Depth
Explain:
- Shadows
- Borders
- Blur
- Layering
- Product image treatment
- How depth is created without clutter

## Shapes
Explain:
- Border radius strategy
- Button geometry
- Card geometry
- Image geometry
- Chips, pills, rectangles, sharp corners
- Whether the brand prefers soft, rigid, or mixed geometry

## Components
For each major component visible in the screenshot, define:
- Component name
- Background
- Text color
- Typography
- Radius
- Padding
- Height if visible
- Special state if visible

Examples:
- button-primary
- button-secondary
- nav-bar
- hero-band
- card-feature
- card-pricing
- pill-tag
- text-input
- product-mockup
- footer

## Responsive Behavior
Infer how the system likely collapses on smaller screens.
State only what is supported by evidence or strong visual logic.
If uncertain, say that it is inferred.

## Do / Don't
Write brand rules.
Include:
- what must be kept
- what must stay scarce
- what must never be added
- what breaks the brand

## Iteration Guide
Write practical rules for future edits.
Explain:
- how to keep consistency
- what to preserve first
- what to change carefully
- what elements define the system most strongly

## Known Gaps
List the things that cannot be confirmed from the screenshot alone.
Be direct.

WRITING STYLE
- Clear
- Structured
- Design-aware
- Specific
- Confident but not fake
- No fluff
- No generic adjectives without proof
- No poetic nonsense unless the brand visibly supports it

QUALITY BAR
Your output should feel like a real reverse-engineered design system from a professional design team.
The reader should be able to build a matching homepage from the document.

FINAL SELF-CHECK
Before responding, ask:
- Did I identify the dominant visual rule?
- Did I capture the brand's core atmosphere?
- Did I describe the system, not just the screenshot?
- Did I avoid hallucinating hidden details?
- Did I write a usable DESIGN.md, not a loose summary?

If any answer is no, revise before outputting.

IMPORTANT: Return ONLY the raw Markdown text. Do NOT wrap the response in markdown code blocks (\`\`\`markdown). Do not include any conversational filler.`;

// Sleep utility
const sleep = ms => new Promise(r => setTimeout(r, ms));

// AI API Gateway with Exponential Backoff Retry
async function analyzeImage(base64DataUrl) {
  if (!state.apiKey) {
    showToast('Please configure your API key in Settings.');
    elements.settingsModal.classList.remove('opacity-0', 'pointer-events-none');
    elements.settingsModal.querySelector('.modal-glass').classList.remove('scale-95');
    elements.settingsModal.querySelector('.modal-glass').classList.add('scale-100');
    return;
  }

  triggerLoadingState(true);
  
  const MAX_RETRIES = 3;
  let attempt = 0;
  let success = false;
  let markdownText = '';

  while (attempt < MAX_RETRIES && !success) {
    try {
      const match = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) throw new Error('Invalid base64 encoding');
      const mimeType = match[1];
      const base64Data = match[2];

      if (state.provider === 'gemini') {
        markdownText = await analyzeGoogle({
          apiKey: state.apiKey,
          mimeType,
          base64Data,
          systemPrompt: SYSTEM_PROMPT,
          model: state.cloudModel
        });
      } else if (state.provider === 'claude') {
        markdownText = await analyzeClaude({
          apiKey: state.apiKey,
          model: state.cloudModel,
          base64DataUrl,
          systemPrompt: SYSTEM_PROMPT
        });
      } else if (state.provider === 'openai') {
        markdownText = await analyzeOpenAI({
          apiKey: state.apiKey,
          model: state.cloudModel,
          base64DataUrl,
          systemPrompt: SYSTEM_PROMPT
        });
      } else if (state.provider === 'openrouter') {
        markdownText = await analyzeOpenRouter({
          apiKey: state.apiKey,
          model: state.cloudModel,
          base64DataUrl,
          systemPrompt: SYSTEM_PROMPT
        });
      } else if (state.provider === 'ollama') {
        markdownText = await analyzeOllama({
          apiKey: state.apiKey,
          model: state.ollamaModel,
          base64Data,
          systemPrompt: SYSTEM_PROMPT,
          endpoint: state.ollamaEndpoint
        });
      }

      if (!markdownText) throw new Error('Empty response from model');

      success = true;
    } catch (error) {
      attempt++;
      console.error(`Analysis attempt ${attempt} failed:`, error);
      if (attempt >= MAX_RETRIES) {
        showToast(`Error: ${error.message}`);
        triggerLoadingState(false, error);
        return;
      }
      showToast(`Error connecting. Retrying... (${attempt}/${MAX_RETRIES})`);
      await sleep(1000 * Math.pow(2, attempt - 1)); // Exponential backoff: 1s, 2s
    }
  }

  if (success) {
    // Strip markdown wrappers if present
    markdownText = markdownText.replace(/^\`\`\`markdown\n?/, '').replace(/\n?\`\`\`$/, '').trim();
    
    state.generatedMarkdown = markdownText;
    renderAnalysisData(markdownText);
    showToast('Analysis Complete!');
    triggerLoadingState(false);
  }
}

// Handle Rotating Status Text
let loadingStatusInterval = null;

function startLoadingStatusRotation() {
  if (!elements.generationStatusText) return;
  
  const statuses = [
    'Reading the screenshot',
    'Detecting layout structure',
    'Finding the colors',
    'Understanding the positioning',
    'Analyzing typography',
    'Mapping sections',
    'Writing the Design.md',
    'Refining output'
  ];
  
  // Shuffle statuses randomly
  const shuffled = [...statuses].sort(() => Math.random() - 0.5);
  
  let index = 0;
  elements.generationStatusText.textContent = shuffled[0] + '...';
  
  if (loadingStatusInterval) clearInterval(loadingStatusInterval);
  
  loadingStatusInterval = setInterval(() => {
    index = (index + 1) % shuffled.length;
    elements.generationStatusText.textContent = shuffled[index] + '...';
  }, 2000);
}

function stopLoadingStatusRotation() {
  if (loadingStatusInterval) {
    clearInterval(loadingStatusInterval);
    loadingStatusInterval = null;
  }
}

// Handle Skeleton Loaders & Scanner Line
function triggerLoadingState(isLoading, error = null) {
  state.isAnalyzing = isLoading;
  
  if (isLoading) {
    if (elements.resultsPanel) {
      elements.resultsPanel.classList.remove('hidden');
      elements.resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (elements.resultsPlaceholder) elements.resultsPlaceholder.classList.add('hidden');
    elements.resultsCard.classList.remove('hidden');
    elements.resultsCard.classList.add('flex');
    elements.scannerLine.classList.remove('opacity-0');
    elements.scannerLine.classList.add('opacity-100', 'animate-pulse');
    
    elements.markdownOutputPlaceholder.classList.remove('hidden');
    elements.markdownOutputPlaceholder.classList.add('flex');
    elements.markdownOutput.classList.add('hidden');
    if (elements.markdownOutputError) {
      elements.markdownOutputError.classList.add('hidden');
      elements.markdownOutputError.classList.remove('flex');
    }
    
    // Hide show-more elements during loading so they don't overlay on a blank page
    if (elements.showMoreBtn) elements.showMoreBtn.classList.add('hidden');
    if (elements.markdownFade) elements.markdownFade.classList.add('hidden');
    
    startLoadingStatusRotation();
  } else {
    elements.scannerLine.classList.add('opacity-0');
    elements.scannerLine.classList.remove('opacity-100', 'animate-pulse');
    
    elements.markdownOutputPlaceholder.classList.add('hidden');
    elements.markdownOutputPlaceholder.classList.remove('flex');
    
    if (error) {
      if (elements.markdownOutputError) {
        elements.markdownOutputError.classList.remove('hidden');
        elements.markdownOutputError.classList.add('flex');
      }
      if (elements.errorMessageText) {
        elements.errorMessageText.textContent = error.message || error;
      }
      elements.markdownOutput.classList.add('hidden');
      // Hide show-more elements on error
      if (elements.showMoreBtn) elements.showMoreBtn.classList.add('hidden');
      if (elements.markdownFade) elements.markdownFade.classList.add('hidden');
    } else {
      if (elements.markdownOutputError) {
        elements.markdownOutputError.classList.add('hidden');
        elements.markdownOutputError.classList.remove('flex');
      }
      elements.markdownOutput.classList.remove('hidden');
    }
    
    stopLoadingStatusRotation();
  }
}

// Render parsed analysis data to DOM
function renderAnalysisData(markdown) {
  if (elements.resultsPanel) elements.resultsPanel.classList.remove('hidden');
  if (elements.resultsPlaceholder) elements.resultsPlaceholder.classList.add('hidden');
  elements.resultsCard.classList.remove('hidden');
  elements.resultsCard.classList.add('flex');
  
  elements.markdownOutput.textContent = markdown;
  
  // reset show more logic
  if(elements.showMoreBtn && elements.markdownContainer && elements.markdownFade) {
    elements.markdownContainer.classList.add('max-h-[400px]');
    elements.markdownContainer.classList.remove('max-h-[none]');
    elements.showMoreBtn.textContent = 'Show More';
    
    // Check if height exceeds 400px
    setTimeout(() => {
      if(elements.markdownContainer.scrollHeight > 400) {
        elements.showMoreBtn.classList.remove('hidden');
        elements.markdownFade.classList.remove('hidden');
      } else {
        elements.showMoreBtn.classList.add('hidden');
        elements.markdownFade.classList.add('hidden');
      }
    }, 50);
  }
}

// Clipboard copying utility
function copyToClipboard(text, message) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast(message);
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
    showToast('Failed to copy');
  });
}

function downloadMarkdownFile() {
  if (!state.generatedMarkdown) return;
  
  const blob = new Blob([state.generatedMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DESIGN.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('File downloaded');
}


// History Logic
function saveToHistory(name, content) {
  const newEntry = {
    id: Date.now().toString(),
    name,
    content,
    date: new Date().toLocaleDateString()
  };
  state.history.unshift(newEntry);
  localStorage.setItem('pf_history', JSON.stringify(state.history));
}

function renderHistoryList() {
  elements.historyList.innerHTML = '';
  if (state.history.length === 0) {
    elements.emptyHistoryMsg.classList.remove('hidden');
    return;
  }
  
  elements.emptyHistoryMsg.classList.add('hidden');
  
  state.history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'border border-[var(--color-border)] rounded-lg p-4 flex flex-col gap-3 bg-[var(--color-surface)] mb-4';
    
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-white">${item.name}</h3>
          <p class="text-[12px] text-[var(--color-text-muted)]">${item.date}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary text-[12px] px-3 py-1 copy-hist-btn" data-id="${item.id}">Copy</button>
          <button class="btn-dark-utility text-[12px] px-3 py-1 delete-hist-btn" data-id="${item.id}">Delete</button>
        </div>
      </div>
      <pre class="text-[12px] text-[var(--color-text-muted)] max-h-24 overflow-y-auto whitespace-pre-wrap bg-black p-2 rounded-md border border-[var(--color-border)]">${item.content}</pre>
    `;
    
    elements.historyList.appendChild(div);
  });
  
  document.querySelectorAll('.copy-hist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const item = state.history.find(h => h.id === id);
      if (item) copyToClipboard(item.content, 'Design copied to clipboard!');
    });
  });
  
  document.querySelectorAll('.delete-hist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      state.history = state.history.filter(h => h.id !== id);
      localStorage.setItem('pf_history', JSON.stringify(state.history));
      renderHistoryList();
    });
  });
}

// Show active toast display
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;
  elements.toastMsgBox.classList.remove('hidden');
  
  toastTimeout = setTimeout(() => {
    elements.toastMsgBox.classList.add('hidden');
  }, 3000);
}

// ClickSpark Animation Logic
function initClickSpark() {
  const canvas = document.createElement('canvas');
  canvas.id = 'click-spark-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '99999',
    userSelect: 'none',
    display: 'block'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const sparks = [];
  const sparkColor = '#ffffff';
  const sparkSize = 12;
  const sparkRadius = 24;
  const sparkCount = 8;
  const duration = 450; // ms

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });
  resizeCanvas();

  const easeOut = t => t * (2 - t);

  window.addEventListener('click', (e) => {
    // Avoid spawning sparks if click is on select elements or settings dropdown
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;

    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      });
    }
  });

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      const elapsed = timestamp - spark.startTime;

      if (elapsed >= duration) {
        sparks.splice(i, 1);
        continue;
      }

      const progress = elapsed / duration;
      const eased = easeOut(progress);

      const distance = eased * sparkRadius;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// CardNav Animation Logic
function initCardNav() {
  const navEl = document.getElementById('card-nav');
  const hamburger = document.getElementById('hamburger-menu');
  const contentEl = navEl?.querySelector('.card-nav-content');
  const cards = navEl?.querySelectorAll('.nav-card');
  const ctaBtn = document.getElementById('nav-cta-btn');
  
  if (!navEl || !hamburger || !contentEl) return;

  let isExpanded = false;
  let tl = null;

  const calculateHeight = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const topBar = 60;
      const padding = 16;
      let totalHeight = 0;
      cards.forEach(card => {
        totalHeight += card.offsetHeight + 8; // card height + gap
      });
      return topBar + totalHeight + padding;
    }
    return 260; // desktop height
  };

  const createTimeline = () => {
    // Reset layout
    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cards, { y: 50, opacity: 0 });

    const newTl = gsap.timeline({ paused: true });

    newTl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out'
    });

    newTl.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
      stagger: 0.08
    }, '-=0.1');

    return newTl;
  };

  tl = createTimeline();

  const toggleMenu = () => {
    if (!isExpanded) {
      hamburger.classList.add('open');
      navEl.classList.add('open');
      isExpanded = true;
      contentEl.setAttribute('aria-hidden', 'false');
      // Re-create timeline to get fresh heights
      tl.kill();
      tl = createTimeline();
      tl.play();
    } else {
      hamburger.classList.remove('open');
      navEl.classList.remove('open');
      isExpanded = false;
      contentEl.setAttribute('aria-hidden', 'true');
      tl.reverse();
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (isExpanded && !navEl.contains(e.target)) {
      toggleMenu();
    }
  });

  // Handle CTA Click (Scroll to Upload Zone or redirect to home)
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const uploadZone = document.getElementById('upload-zone');
      if (uploadZone) {
        uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.location.href = '/';
      }
    });
  }

  // Handle Settings and History links in Nav Card
  const settingsLink = document.getElementById('nav-settings-link');
  const historyLink = document.getElementById('nav-history-link');

  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      const settingsModal = document.getElementById('settings-modal');
      if (settingsModal) {
        e.preventDefault();
        toggleMenu();
        settingsModal.classList.remove('opacity-0', 'pointer-events-none');
        settingsModal.querySelector('.modal-glass').classList.remove('scale-95');
        settingsModal.querySelector('.modal-glass').classList.add('scale-100');
      }
    });
  }

  if (historyLink) {
    historyLink.addEventListener('click', (e) => {
      const historyViewModal = document.getElementById('history-view-modal');
      if (historyViewModal) {
        e.preventDefault();
        toggleMenu();
        renderHistoryList();
        historyViewModal.classList.remove('opacity-0', 'pointer-events-none');
        historyViewModal.querySelector('.modal-glass').classList.remove('scale-95');
        historyViewModal.querySelector('.modal-glass').classList.add('scale-100');
      }
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (isExpanded) {
      gsap.set(navEl, { height: calculateHeight() });
    }
  });
}

// BorderGlow Animation Logic
function initBorderGlow() {
  const cards = document.querySelectorAll('.border-glow-card');
  
  cards.forEach(card => {
    const onPointerMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = e.clientX - (rect.left + centerX);
      const dy = e.clientY - (rect.top + centerY);
      const angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI + 90;
      if (angleDeg < 0) angleDeg += 360;
      
      const distLeft = x;
      const distRight = width - x;
      const distTop = y;
      const distBottom = height - y;
      
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      const isInside = x >= 0 && x <= width && y >= 0 && y <= height;
      
      let proximity = 0;
      if (isInside) {
        const maxEdgeDist = Math.min(centerX, centerY);
        proximity = Math.max(0, 100 * (1 - minDist / maxEdgeDist));
      } else {
        const dxOutside = Math.max(0, rect.left - e.clientX, e.clientX - rect.right);
        const dyOutside = Math.max(0, rect.top - e.clientY, e.clientY - rect.bottom);
        const distOutside = Math.sqrt(dxOutside * dxOutside + dyOutside * dyOutside);
        
        const maxInfluenceDist = 150;
        proximity = Math.max(0, 100 * (1 - distOutside / maxInfluenceDist));
      }
      
      card.style.setProperty('--edge-proximity', proximity);
      card.style.setProperty('--cursor-angle', `${angleDeg}deg`);
    };
    
    const onPointerLeave = () => {
      card.style.setProperty('--edge-proximity', '0');
    };
    
    document.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      const threshold = 150;
      if (
        e.clientX >= rect.left - threshold &&
        e.clientX <= rect.right + threshold &&
        e.clientY >= rect.top - threshold &&
        e.clientY <= rect.bottom + threshold
      ) {
        onPointerMove(e);
      } else {
        onPointerLeave();
      }
    });
  });
}

// Folder Brand Selector Animation Logic
function initFolder() {
  const container = document.getElementById('interactive-folder-container');
  const folderWrapper = container?.querySelector('.folder-wrapper');
  const folder = container?.querySelector('.folder');
  const papers = container?.querySelectorAll('.paper');
  
  if (!container || !folderWrapper || !folder) return;
  
  const openFolder = () => {
    folderWrapper.classList.add('hovered');
    folder.classList.add('open');
    container.classList.add('folder-open');
  };
  
  const closeFolder = () => {
    folderWrapper.classList.remove('hovered');
    folder.classList.remove('open');
    container.classList.remove('folder-open');
  };
  
  folderWrapper.addEventListener('mouseenter', openFolder);
  folderWrapper.addEventListener('mouseleave', closeFolder);
  
  papers.forEach(paper => {
    paper.addEventListener('pointermove', (e) => {
      const rect = paper.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      
      const dx = px - cx;
      const dy = py - cy;
      
      const strength = 12;
      const magnetX = (dx / cx) * strength;
      const magnetY = (dy / cy) * strength;
      
      paper.style.setProperty('--magnet-x', `${magnetX}px`);
      paper.style.setProperty('--magnet-y', `${magnetY}px`);
    });
    
    paper.addEventListener('pointerleave', () => {
      paper.style.setProperty('--magnet-x', '0px');
      paper.style.setProperty('--magnet-y', '0px');
    });
  });
}

// BlurText Entrance Animation Logic
function initBlurText() {
  const elements = document.querySelectorAll('.blur-text');
  elements.forEach((el) => {
    if (el.classList.contains('ready')) return;
    
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    
    el.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'blur-word';
      span.textContent = word;
      span.style.transitionDelay = `${index * 0.05}s`;
      el.appendChild(span);
      
      if (index < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    
    el.classList.add('ready');
    
    requestAnimationFrame(() => {
      const spans = el.querySelectorAll('.blur-word');
      spans.forEach(span => span.classList.add('animate'));
    });
  });
}

// ScrollReveal Word Stagger Logic using GSAP ScrollTrigger
function initScrollReveal() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn('GSAP or ScrollTrigger not loaded yet.');
    return;
  }
  
  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach((el) => {
    if (el.classList.contains('scroll-reveal-ready')) return;
    
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      gsap.set(span, { opacity: 0.15, filter: 'blur(3px)' });
      el.appendChild(span);
      
      if (index < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    
    el.classList.add('scroll-reveal-ready');
    
    const wordSpans = el.querySelectorAll('.word');
    
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 60%',
        scrub: 0.5
      }
    }).to(wordSpans, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.1,
      duration: 1,
      ease: 'power1.out'
    });
  });
}

// FAQ Card Keyboard/Click Trigger Logic
function initFAQ() {
  const cards = document.querySelectorAll('.faq-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

// Run app init
init();
