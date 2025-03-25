
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

// Function to extract text from uploaded file (mock for demo)
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // This is a simplified mock function
    // In a real application, you would use proper libraries to extract text from PDF/DOCX
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        // For plain text files
        if (file.type === 'text/plain') {
          resolve(event.target.result as string);
        } 
        // Mock extraction for PDFs and DOCXs
        else if (file.type === 'application/pdf') {
          resolve(`This is extracted text from the PDF document: ${file.name}`);
        }
        else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          resolve(`This is extracted text from the Word document: ${file.name}`);
        }
        else {
          resolve(`Text extracted from ${file.name}`);
        }
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read as text for simplicity
    reader.readAsText(file);
  });
}
