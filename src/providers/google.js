export async function analyzeGoogle({ apiKey, mimeType, base64Data, systemPrompt, model }) {
  const modelName = model ? model.replace(/^google\//, '') : 'gemini-2.5-flash';
  
  const requestBody = {
    contents: [{
      parts: [
        { text: systemPrompt },
        { inlineData: { mimeType, data: base64Data } }
      ]
    }]
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    let errDetail = `Gemini API error (${response.status})`;
    try { 
      const errJson = await response.json(); 
      if (errJson.error?.message) errDetail = errJson.error.message; 
    } catch(e){}
    throw new Error(errDetail);
  }
  const resData = await response.json();
  const markdownText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!markdownText) throw new Error('Empty response from Gemini');
  return markdownText;
}
