export async function analyzeOpenAI({ apiKey, model, base64DataUrl, systemPrompt }) {
  const modelName = model ? (model === 'openai/gpt-4o' ? 'gpt-4o' : model.replace(/^openai\//, '')) : 'gpt-4o-mini';
  
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    let errDetail = `OpenAI API error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) errDetail = errJson.error.message;
    } catch (e) {}
    throw new Error(errDetail);
  }

  const resData = await response.json();
  const markdownText = resData.choices?.[0]?.message?.content;
  if (!markdownText) throw new Error('Empty response from OpenAI');
  return markdownText;
}
