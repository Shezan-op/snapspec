export async function analyzeClaude({ apiKey, model, base64DataUrl, systemPrompt }) {
  const modelName = model ? model.replace(/^anthropic\//, '') : 'claude-3-7-sonnet-20250219';
  
  // Extract base64 and mime type from base64DataUrl
  const match = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid base64 encoding');
  const mimeType = match[1];
  const base64Data = match[2];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: systemPrompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    let errDetail = `Claude API error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) errDetail = errJson.error.message;
    } catch (e) {}
    throw new Error(errDetail);
  }

  const resData = await response.json();
  const markdownText = resData.content?.[0]?.text;
  if (!markdownText) throw new Error('Empty response from Claude');
  return markdownText;
}
