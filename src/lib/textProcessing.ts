
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
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/public/pdf.worker.js';


export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map(item => (item as any).str).join(' ');
        text += strings + '\n\n';
      } catch (error) {
        console.error(`Error reading page ${pageNum}:`, error);
        text += `\n\n[Error reading page ${pageNum}]\n\n`;
      }

      onProgress?.(Math.round((pageNum / pdf.numPages) * 100));
    }

    return text;
  } catch (error) {
    console.error('Failed to extract PDF text:', error);
    throw new Error('Could not extract text from PDF.');
  }
};


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
    const isImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'].includes(file.type);

    if (isImage) {
      // Use backend EasyOCR for image OCR
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/ocr-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.text || 'No text detected in image.';
    }

    else if (file.type === 'application/pdf') {
      try {
        // First try native PDF text extraction
        const rawText = await extractTextFromPDF(file);
        if (rawText && rawText.length > 50) return rawText;

        // Fallback to OCR for scanned PDFs using backend
        console.log('Falling back to OCR for PDF...');

        const formData = new FormData();
        formData.append('pdf', file);

        const res = await fetch('http://localhost:5000/ocr-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        return data.text || 'No text detected in scanned PDF.';
      } catch (error) {
        console.log('Standard and OCR PDF extraction failed:', error);
        return 'Failed to extract text from PDF.';
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
