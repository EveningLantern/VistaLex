
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

// Extract text from PDF file
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          // @ts-ignore - we're importing the module dynamically
          const pdfParse = await import('pdf-parse');
          const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
          const result = await pdfParse.default(pdfData);
          resolve(result.text);
        } else {
          reject(new Error('Failed to read PDF file'));
        }
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(new Error('Failed to parse PDF file'));
      }
    };
    
    reader.onerror = () => {
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
