
// Function to process text for dyslexia mode
export function processDyslexiaText(text: string, options: { 
  boldFirstLetter: boolean, 
  underlineVerbs: boolean,
  underlineComplexWords: boolean
}) {
  if (!text) return '';
  
  const words = text.split(' ');
  const verbList = ['is', 'are', 'was', 'were', 'have', 'has', 'do', 'does', 'did', 'run', 'walk', 'talk', 'write', 'read', 'speak', 'listen', 'eat', 'drink', 'sleep', 'think', 'feel', 'see', 'hear', 'touch', 'taste', 'smell'];
  
  // Simple list of "complex" words for demo purposes
  const complexWordList = ['accordingly', 'consequently', 'furthermore', 'nevertheless', 'specifically', 'subsequently', 'approximately', 'predominantly', 'sophisticated', 'fundamental', 'philosophical', 'extraordinary', 'comprehensive', 'preliminary', 'controversial', 'demonstrate', 'particularly', 'questionnaire', 'significance', 'technological'];

  // Process words based on options
  return words.map(word => {
    let processedWord = word;
    
    // Bold first letter
    if (options.boldFirstLetter && word.length > 0) {
      processedWord = `<strong>${word.charAt(0)}</strong>${word.slice(1)}`;
    }
    
    // Underline verbs
    if (options.underlineVerbs && verbList.includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''))) {
      processedWord = `<u>${processedWord}</u>`;
    }
    
    // Underline complex words
    if (options.underlineComplexWords && 
        (complexWordList.includes(word.toLowerCase().replace(/[^a-zA-Z]/g, '')) || 
         word.length > 8)) {
      processedWord = `<u>${processedWord}</u>`;
    }
    
    return processedWord;
  }).join(' ');
}

// Function to convert text to ADHD mode (returns array of words)
export function processADHDText(text: string) {
  if (!text) return [];
  
  // Split the text into words and filter out empty strings
  return text.split(/\s+/).filter(word => word.trim().length > 0);
}

// Import pdfjs directly and set the worker source
import * as pdfjs from 'pdfjs-dist';

// This ensures PDF.js works in both browser and worker environments
if (typeof window !== 'undefined') {
  // Use CDN for the worker to ensure it's accessible
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

// Type guard to check if an object is a TextItem with a str property
function isTextItem(item: any): item is { str: string } {
  return item && typeof item.str === 'string';
}

// Enhanced PDF text extraction function with better handling for book PDFs
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error('Failed to read PDF file'));
          return;
        }
        
        try {
          console.log("Starting PDF extraction...");
          // Use pdfjs for text extraction
          const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
          
          // Load the PDF document
          console.log("Loading PDF document...");
          const loadingTask = pdfjs.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
          
          let fullText = '';
          
          // Enhanced text extraction from each page with better handling for book layouts
          for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Enhanced text extraction with better space handling
            const pageText = textContent.items
              .map((item, idx, arr) => {
                // Check if the item has the str property (TextItem vs TextMarkedContent)
                if (!isTextItem(item)) return '';
                
                // Get the current item's text
                const text = item.str || '';
                
                // Add appropriate spacing based on positioning
                // This helps with book layouts that might have columns or special formatting
                if (idx > 0 && arr[idx - 1]) {
                  const prevItem = arr[idx - 1];
                  
                  // Skip if previous item doesn't have transform property
                  if (!isTextItem(prevItem) || !('transform' in prevItem) || !('transform' in item)) {
                    return text;
                  }
                  
                  // Safe access to transform properties
                  const prevTransform = ('transform' in prevItem) ? prevItem.transform : [0, 0, 0, 0, 0, 0];
                  const currTransform = ('transform' in item) ? item.transform : [0, 0, 0, 0, 0, 0];
                  
                  if (!prevTransform || !currTransform || 
                      !Array.isArray(prevTransform) || !Array.isArray(currTransform)) {
                    return text;
                  }
                  
                  // If there's a significant horizontal or vertical position change,
                  // add appropriate spacing
                  const xDiff = Math.abs(currTransform[4] - prevTransform[4]);
                  const yDiff = Math.abs(currTransform[5] - prevTransform[5]);
                  
                  // New line detection (significant y position change)
                  if (yDiff > 5) {
                    return `\n${text}`;
                  }
                  
                  // New paragraph or column detection (significant x position change)
                  if (currTransform[4] < prevTransform[4] && xDiff > 50) {
                    return `\n\n${text}`;
                  }
                }
                return text;
              })
              .join(' ')
              // Clean up excessive whitespace
              .replace(/\s+/g, ' ')
              .trim();
              
            fullText += pageText + '\n\n';
          }
          
          // Clean up the final text for better readability
          const cleanedText = fullText
            .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with just two
            .trim();
          
          if (cleanedText.trim()) {
            console.log("PDF extraction completed successfully!");
            resolve(cleanedText);
          } else {
            console.log("No text found in PDF using direct extraction");
            resolve("No text could be extracted from this PDF. It might be a scanned document requiring OCR.");
          }
        } catch (directExtractError) {
          console.error("Error in PDF extraction:", directExtractError);
          reject(new Error('Failed to extract text from PDF: ' + directExtractError.message));
        }
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(new Error('Failed to parse PDF file: ' + error.message));
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Extract text from DOCX file
export async function extractTextFromDOCX(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          // @ts-ignore - we're importing the module dynamically
          const mammoth = await import('mammoth');
          const result = await mammoth.default.extractRawText({
            arrayBuffer: event.target.result as ArrayBuffer
          });
          resolve(result.value);
        } else {
          reject(new Error('Failed to read DOCX file'));
        }
      } catch (error) {
        console.error('Error parsing DOCX:', error);
        reject(new Error('Failed to parse DOCX file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read DOCX file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Extract text from any supported file type
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    } 
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractTextFromDOCX(file);
    }
    else if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } 
    else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}
