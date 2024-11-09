// utilities.ts
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { getChatMessages } from '@/services/dispatch/chat-dispatch';
import PdfDocument from './PDFdocument';

// Convert file to base64
export const convertToBase64 = async (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Function to download chat history as a PDF
export const downloadHistory = async (id: string): Promise<void> => {
  try {
    // Fetch chat messages based on id
    const history = await getChatMessages(id);
    console.log(history);

    // Convert history to a single string to pass as content

    // Create a PDF blob from the PdfDocument component
    const blob = await pdf(<PdfDocument content={history} />).toBlob();
    
    const fileName = `${history.conversation_id}.pdf`;
    console.log(blob);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error downloading history:', error);
  }
};

export const formatDate=(dateString: any)=> {
  return new Date(dateString as string).toLocaleString()
}