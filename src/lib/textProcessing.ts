
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

// Set the worker source path
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
}

// Type guard to check if an object is a TextItem with a str property
function isTextItem(item: any): item is { str: string } {
  return item && typeof item.str === 'string';
}

// Improved PDF text extraction function
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
          
          // Process each page
          for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Extract text from the page
            let pageText = '';
            let lastY;
            let currentLine = '';
            
            for (let j = 0; j < textContent.items.length; j++) {
              const item = textContent.items[j];
              
              if (!isTextItem(item)) continue;
              
              const text = item.str;
              
              // Check for new line based on y-position difference
              if (lastY !== undefined && ('transform' in item)) {
                const y = item.transform[5];
                const yDiff = Math.abs(y - lastY);
                
                // If position indicates a new line
                if (yDiff > 5) {
                  pageText += currentLine.trim() + '\n';
                  currentLine = text + ' ';
                } else {
                  currentLine += text + ' ';
                }
                
                lastY = y;
              } else if ('transform' in item) {
                currentLine += text + ' ';
                lastY = item.transform[5];
              } else {
                currentLine += text + ' ';
              }
            }
            
            // Add the last line
            pageText += currentLine.trim();
            
            // Add the page text to the full text
            fullText += pageText + '\n\n';
          }
          
          // Clean up the text
          fullText = fullText.replace(/\s+/g, ' ').trim();
          
          if (fullText.trim()) {
            console.log("PDF extraction completed successfully!");
            resolve(fullText);
          } else {
            console.log("No text found in PDF using direct extraction");
            resolve("No machine-readable text found. This appears to be a scanned document. Try using the OCR feature for better results.");
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

// Enhanced function to handle OCR for images
export async function performOCROnImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Use Tesseract.js for OCR
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker({
              logger: m => console.log(m)
            });
            
            // Initialize with English language
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            
            // Recognize text from the image
            const { data } = await worker.recognize(img.src);
            await worker.terminate();
            
            if (data.text.trim()) {
              resolve(data.text);
            } else {
              resolve("No text was detected in this image.");
            }
          } catch (error) {
            console.error("OCR processing error:", error);
            reject(new Error(`OCR failed: ${error.message}`));
          }
        };
        img.onerror = () => {
          reject(new Error("Failed to load image for OCR"));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error("Failed to read image file"));
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      reject(new Error(`OCR initialization failed: ${error.message}`));
    }
  });
}

// Extract text from any supported file type
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    // Add image formats for OCR
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'].includes(file.type)) {
      return await performOCROnImage(file);
    }
    else if (file.type === 'application/pdf') {
      try {
        // First try normal PDF extraction
        return await extractTextFromPDF(file);
      } catch (error) {
        // If normal extraction fails, could indicate a scanned PDF
        console.log("Standard PDF extraction failed, this may be a scanned document");
        return "This appears to be a scanned PDF. Please use the OCR feature for better results.";
      }
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
