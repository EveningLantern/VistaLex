
import { GEMINI_CONFIG } from './summarizeText';

/**
 * List of supported Indian languages for translation
 */
export const INDIAN_LANGUAGES = [
  { name: 'Bengali', code: 'bn' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Malayalam', code: 'ml' },
  { name: 'Gujarati', code: 'gu' },
  { name: 'Punjabi', code: 'pa' },
  { name: 'Urdu', code: 'ur' }
];

/**
 * Translates text using the Gemini API
 * @param text - Text to translate
 * @param targetLanguage - Target language name
 * @returns Promise resolving to translated text
 */
export async function translateTextWithGemini(text: string, targetLanguage: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "No text to translate";
  }
  
  try {
    // Truncate text if it's too long (Gemini has token limits)
    const truncatedText = text.length > GEMINI_CONFIG.maxTextLength 
      ? text.substring(0, GEMINI_CONFIG.maxTextLength) + "..." 
      : text;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Translate the following text to ${targetLanguage}:\n\n${truncatedText}`
            }
          ]
        }
      ],
      generationConfig: {
        ...GEMINI_CONFIG.generationConfig,
        temperature: 0.1 // Lower temperature for more accurate translations
      }
    };
    
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
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.length) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error translating text:', error);
    
    if (error instanceof Error) {
      return `Error translating text: ${error.message}`;
    }
    
    return 'Error translating text: Unknown error occurred';
  }
}
