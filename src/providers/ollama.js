export async function analyzeOllama({ apiKey, model, base64Data, systemPrompt, endpoint }) {
  if (!model) {
    throw new Error('Please enter an Ollama model name in Settings (e.g. qwen3-vl:235b)');
  }
  const headers = { 'Content-Type': 'application/json' };
  
  let baseUrl = (endpoint || 'https://ollama.com').replace(/\/+$/, '');
  let fetchUrl;

  // If it's the Ollama cloud (ollama.com), proxy through Vite dev server to avoid CORS
  if (baseUrl.includes('ollama.com')) {
    fetchUrl = '/api/ollama-cloud/api/chat';
  } else {
    fetchUrl = `${baseUrl}/api/chat`;
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: systemPrompt,
          images: [base64Data]
        }
      ],
      stream: false
    })
  });
  
  if (!response.ok) {
    let errDetail = `Ollama API error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error) errDetail = errJson.error;
    } catch (e) {}
    throw new Error(errDetail);
  }
  const resData = await response.json();
  const markdownText = resData.message?.content;
  if (!markdownText) throw new Error('Empty response from Ollama');
  return markdownText;
}
