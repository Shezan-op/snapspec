export async function analyzeOpenRouter({ apiKey, model, base64DataUrl, systemPrompt }) {
  const modelName = model || 'openrouter/free';
  
  const headers = { 
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.href,
    'X-Title': 'Design-md Creator'
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are an expert design engineer. Always output pure Markdown.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'image_url', image_url: { url: base64DataUrl } }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    let errDetail = `OpenRouter API error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) errDetail = errJson.error.message;
    } catch (e) {}
    throw new Error(errDetail);
  }

  const resData = await response.json();
  const markdownText = resData.choices?.[0]?.message?.content;
  if (!markdownText) throw new Error('Empty response from OpenRouter');
  return markdownText;
}
