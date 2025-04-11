
// Configuration constants for Gemini API
const GEMINI_CONFIG = {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  apiKey: 'AIzaSyA98M3QYhUZm_UMok52r6XsAk1UJoPSq_Y',
  maxTextLength: 30000,
  generationConfig: {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
};

/**
 * Validates the input text before processing
 * @param text - Text to be validated
 * @returns Validation result message or null if valid
 */
function validateInput(text: string): string | null {
  if (!text || text.trim().length === 0) {
    return "No text to summarize";
  }
  
  return null;
}

/**
 * Creates the request body for the Gemini API
 * @param text - Text to be summarized
 * @returns Request body object
 */
function createGeminiRequestBody(text: string) {
  // Truncate text if it's too long (Gemini has token limits)
  const truncatedText = text.length > GEMINI_CONFIG.maxTextLength 
    ? text.substring(0, GEMINI_CONFIG.maxTextLength) + "..." 
    : text;
  
  return {
    contents: [
      {
        parts: [
          {
            text: `Summarize the following with beautiful emojis:\n\n${truncatedText}`
          }
        ]
      }
    ],
    generationConfig: GEMINI_CONFIG.generationConfig
  };
}

/**
 * Makes the API request to Gemini
 * @param requestBody - The formatted request body
 * @returns Promise resolving to the summary text
 */
async function makeGeminiRequest(requestBody: any): Promise<string> {
  const response = await fetch(
    `${GEMINI_CONFIG.apiEndpoint}?key=${GEMINI_CONFIG.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error:', errorData);
    throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  
  // Extract the summary from the response
  if (!data.candidates || !data.candidates[0]?.content?.parts?.length) {
    throw new Error('Invalid response format from Gemini API');
  }
  
  return data.candidates[0].content.parts[0].text;
}

/**
 * Handles errors during the summarization process
 * @param error - The error object
 * @returns Error message string
 */
function handleSummarizationError(error: unknown): string {
  console.error('Error summarizing text:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('API error: 429')) {
      return 'Rate limit exceeded. Please try again later.';
    } else if (error.message.includes('API error: 403')) {
      return 'API key unauthorized or quota exceeded.';
    } else {
      return `Error summarizing text: ${error.message}`;
    }
  }
  
  return 'Error summarizing text: Unknown error occurred';
}

/**
 * Main function to summarize text using Google's Gemini API
 * @param text - Text to summarize
 * @returns Promise resolving to summarized text or error message
 */
export async function summarizeTextWithGemini(text: string): Promise<string> {
  try {
    // Validate input
    const validationError = validateInput(text);
    if (validationError) {
      return validationError;
    }
    
    // Create request body
    const requestBody = createGeminiRequestBody(text);
    
    // Make API request and get summary
    return await makeGeminiRequest(requestBody);
  } catch (error) {
    return handleSummarizationError(error);
  }
}
