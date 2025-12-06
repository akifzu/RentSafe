// API Service for making HTTP requests

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface AIRequest {
  message: string;
  files?: File[];
  context?: string;
}

export interface AIResponse {
  response: string;
  error?: string;
}

/**
 * Convert File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Make API call to AI service with FormData (supports file uploads)
 */
export const callAIService = async (request: AIRequest): Promise<AIResponse> => {
  try {
    // Prepare form data if files are included
    const formData = new FormData();
    formData.append('message', request.message);
    
    if (request.context) {
      formData.append('context', request.context);
    }

    // Add files if provided
    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      response: data.response || data.message || 'No response received',
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      response: '',
      error: error instanceof Error ? error.message : 'Failed to connect to AI service',
    };
  }
};

/**
 * Alternative: Call AI service with JSON (if your backend expects JSON)
 */
export const callAIServiceJSON = async (request: AIRequest): Promise<AIResponse> => {
  try {
    // Convert files to base64 if provided
    const fileData = request.files
      ? await Promise.all(request.files.map(fileToBase64))
      : [];

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: request.message,
        files: fileData,
        context: request.context,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      response: data.response || data.message || 'No response received',
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      response: '',
      error: error instanceof Error ? error.message : 'Failed to connect to AI service',
    };
  }
};

