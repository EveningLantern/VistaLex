export const detectEmotion = async (imageBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam.jpg');
  
    const response = await fetch('http://localhost:8000/detect-emotion', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Emotion detection failed');
    }
  
    return response.json();
  };