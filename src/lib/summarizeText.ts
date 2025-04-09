
// Function to summarize text using Google's Gemini API
export async function summarizeTextWithGemini(text: string): Promise<string> {
  try {
    // Updated API key for Gemini
    const apiKey = '03c8bfe7aafc4eddb8ee3246003c4d9d.2sv2sJ6DGT34oDVi';
    
    // Check if there's text to summarize
    if (!text || text.trim().length === 0) {
      return "No text to summarize";
    }
    
    // Truncate text if it's too long (Gemini has token limits)
    const truncatedText = text.length > 30000 ? text.substring(0, 30000) + "..." : text;
    
    // Create the request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Please provide a concise summary of the following text, highlighting the main points and key information:\n\n${truncatedText}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    // Make the API request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    // Handle the response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the summary from the response
    const summary = data.candidates[0].content.parts[0].text;
    return summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return `Error summarizing text: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

