
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

// Import the required typings from pdfjs-dist
import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// Enhanced PDF text extraction with OCR fallback for scanned documents
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          // First try to extract text directly
          try {
            // Dynamic import of pdf-parse
            const pdfParse = await import('pdf-parse');
            const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
            const result = await pdfParse.default(pdfData);
            
            // If we got meaningful text, return it
            if (result.text.trim()) {
              resolve(result.text);
              return;
            }
            
            console.log("No text found in PDF using direct extraction, attempting OCR...");
            // If no text found, process using OCR
            const extractedText = await processScannedPDFWithOCR(file);
            resolve(extractedText);
          } catch (directExtractError) {
            console.error("Error in direct PDF extraction:", directExtractError);
            // Fallback to OCR if direct extraction fails
            const extractedText = await processScannedPDFWithOCR(file);
            resolve(extractedText);
          }
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

// Process scanned PDF using OCR
async function processScannedPDFWithOCR(file: File): Promise<string> {
  try {
    // First convert PDF to images
    const pdfImages = await pdfToImages(file);
    
    // Then process images with Tesseract OCR
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    let fullText = '';
    try {
      for (const img of pdfImages) {
        const { data: { text } } = await worker.recognize(img);
        fullText += text + '\n';
        URL.revokeObjectURL(img);
      }
    } finally {
      await worker.terminate();
    }
    
    return fullText;
  } catch (error) {
    console.error('OCR processing error:', error);
    return 'Error processing document with OCR. Please try a different file.';
  }
}

// Convert PDF to array of image URLs
async function pdfToImages(file: File): Promise<string[]> {
  try {
    // Load pdfjs library
    const pdfjsLib = await import('pdfjs-dist');
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const fileURL = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(fileURL).promise as PDFDocumentProxy;
    const images: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) continue;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to blob URL
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((b) => resolve(b as Blob), 'image/png')
      );
      images.push(URL.createObjectURL(blob));
    }
    
    URL.revokeObjectURL(fileURL);
    return images;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    return [];
  }
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
