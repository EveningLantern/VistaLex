
import * as faceapi from 'face-api.js';

// Track if models are loaded to avoid loading multiple times
let modelsLoaded = false;

/**
 * Load face-api.js models from public directory
 */
export const loadFaceApiModels = async () => {
  if (modelsLoaded) return;
  
  try {
    // Load models from public folder
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
    
    modelsLoaded = true;
    console.log('Face-API models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error('Failed to load facial recognition models');
  }
};

/**
 * Detect facial expressions from an image
 * @param imageSrc Base64 image data or URL
 * @returns The dominant emotion detected, or null if no face found
 */
export const detectFaceExpressions = async (imageSrc: string): Promise<string | null> => {
  try {
    // Create HTMLImageElement from the source
    const img = await createImageElement(imageSrc);
    
    // Detect faces with expressions
    const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    
    if (!detections) {
      return null;
    }
    
    // Get the dominant expression
    const expressions = detections.expressions;
    let dominantEmotion = 'neutral';
    let highestScore = 0;
    
    Object.entries(expressions).forEach(([emotion, score]) => {
      if (score > highestScore) {
        highestScore = score;
        dominantEmotion = emotion;
      }
    });
    
    return dominantEmotion;
  } catch (error) {
    console.error('Error detecting expressions:', error);
    throw new Error('Failed to analyze facial expressions');
  }
};

/**
 * Helper function to create an image element from image source
 */
const createImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};
