# Changelog

All notable changes to the SnapSpec (Design-md Creator) project will be documented in this file.

## [1.1.0] - 2026-06-13

### Added
- **Natural Generation Status**: Replaced skeleton loaders/fake progress bars with text-based rotating status messages (e.g. *Reading the screenshot*, *Detecting layout structure*) while `Design.md` is generating. Order is randomized to feel organic and alive. Stops immediately when output is ready.
  - *Why*: Reduces perceived wait times and increases trust in the generation process.
  - *User Benefit*: Believable and transparent generation feedback that keeps users engaged.
- **Custom LLM Model Support**: Added a toggle button "Use Custom Model" in API Settings. Users can type any cloud model name (e.g. `meta-llama/llama-3.1-405b`) to run it using the same API key workflow.
  - *Why*: Gives power users the flexibility to test any LLM without cluttering the UI with extra endpoint inputs.
  - *User Benefit*: Absolute model choice freedom with zero configuration hassle.
- **"Show More Demos" Toggle**: Integrated a collapse/expand mechanism in the demo list to display only 5 items by default.
  - *Why*: Prevents page bloat above-the-fold while supporting unlimited future demos.
  - *User Benefit*: Cleaner dashboard alignment and faster page scanning.
- **Interactive Preview & Spec Separation**: Styled the `DESIGN.md` link as a clean file badge, and the `Live Interactive Preview` as a primary action button.
  - *Why*: Resolves layout confusion between visual previews and specifications.
  - *User Benefit*: Obvious, self-explanatory actions for demo exploration.
- **Curated Agent Skills Product Page**: Rewrote the `skills.html` placeholder page into a complete product feature tour explaining the concepts of instructions, best practices, and resources, with live copyable `npx skills add` installation snippets and featured library listings.
  - *Why*: Provides immediate, actionable utility rather than a "Coming soon" roadblock.
  - *User Benefit*: Quick learning curve for setting up multi-agent capabilities.
- **Ollama Cloud Models Routing**: Fixed the "failed to fetch" CORS issue when querying Ollama by dynamically routing Ollama API calls to `/api/ollama-cloud` (using our Vite server proxy) when an API key is present.
  - *Why*: Resolves cross-origin query restrictions and enables direct use of the Ollama Cloud Models API.
  - *User Benefit*: Flawless Ollama Cloud Model execution from the browser dashboard.
- **Ollama Cloud Presets Locking**: Replaced the outdated Ollama model list with the exact cloud models supported by Ollama: `qwen3-vl:235b-cloud`, `deepseek-v3.1:671b-cloud`, `gpt-oss:20b-cloud`, `gpt-oss:120b-cloud`, `kimi-k2:1t-cloud`, `qwen3-coder:480b-cloud`, and `glm-4.6:cloud`.
  - *Why*: Keeps user selections relevant to remote Ollama Cloud hosting.
  - *User Benefit*: Prevents input errors by restricting selections to verified cloud models.

### Changed
- **Instant Output Panel Visibility**: Updated the layout manager to immediately display the results panel (displaying skeletons and rotating messages) and smoothly scroll to it when the user triggers generation.
  - *Why*: Prevents user confusion by proving that the generator is active and working instantly.
  - *User Benefit*: Clear visual cues and direct focus redirection on generation launch.
- **Tighter Spacing & Padding**: Trimmed excess margin and padding from the homepage footer and base application container.
  - *Why*: Reduces blank vertical gaps at the bottom of the landing page.
  - *User Benefit*: A much cleaner page termination matching the premium design spec.
- **Footer Clean Up**: Removed the harsh outer frame outline (`border-[#2A2A2A] rounded-[24px] bg-[#050505]`) from the main footer to integrate it smoothly into the page backdrop. Added a subtle top border divider.
  - *Why*: Softens visual rhythm and establishes premium modern card hierarchy.
  - *User Benefit*: Cleaner page termination and elevated aesthetic quality.
- **Secondary Page Footer Simplification**: Removed duplicate footer details and giant logo marks from doc-like secondary pages (`whats-next.html`, `skills.html`, `changelog.html`), substituting them with a lightweight borderless copyright strip.
  - *Why*: Reduces page length and noise on utility pages.
  - *User Benefit*: Focused readability without irrelevant navigation blocks.
- **API Model Options Update**: Refreshed the preset dropdowns with modern selections:
  - **Cloud**: Added `anthropic/claude-3.7-sonnet`, `google/gemini-2.5-pro`, and `openai/gpt-4o-mini`.
  - **Ollama**: Replaced the outdated list with the current Ollama library versions (e.g., `kimi-k2.7-code`, `minimax-m3`, `gemma4`, `qwen3.5`, `gemma3`, `mistral-large-3`, etc.).
  - *Why*: Keeps model access modern and relevant.
  - *User Benefit*: Out-of-the-box access to the latest frontier models.
- **Mobile Responsive Audit**: Verified and scaled all preview pages (`attio`, `rotoris`, `figma`, `cursor`, `framer`, `timex`) with proper viewports and layouts to prevent horizontal scrolling or broken elements.
  - *Why*: Ensures a seamless experience when viewing previews on mobile/installed PWA standalone apps.
  - *User Benefit*: Perfect mobile rendering during portable testing.

## [1.0.0] - 2026-06-13

### Added
- Created `skills.html` placeholder page.
- Created `changelog.html` page to display updates directly on the site.
- Added a "Frequently Asked Questions" (FAQ) section using a clean dropdown/accordion style on the homepage.
- Implemented a new "Subscribe" popup modal to capture interest when users copy or download `DESIGN.md` blueprints.
- Added a "Show More" toggle functionality to the `DESIGN.md` markdown preview container to prevent excessive scrolling.

### Changed
- Replaced static wordmark image with crisp, scalable live text (`Inter` font, bold) for improved performance and retina-ready display across the application.
- Redesigned the footer layout to align with premium design aesthetics.
- Updated all demo preview links to open in a new tab (`target="_blank"`) to preserve user workflow.
