import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Inline SpeechRecognition Type Declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

type SpeechToTextHook = {
  transcript: string;
  isListening: boolean;
  toggleListening: () => void;
  isLoading: boolean
};

// Speech recognition utility function
const getSpeechRecognition = (): SpeechRecognition | null => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognition ? new SpeechRecognition() : null;
};

export const useSpeechToText = (): SpeechToTextHook => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recognition] = useState<SpeechRecognition | null>(getSpeechRecognition);

  useEffect(() => {
    if (!recognition) {
      console.warn('Speech Recognition API is not supported in this browser');
      return;
    }
    

    // Configure the SpeechRecognition instance
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Event handler for speech results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Only update the transcript if `isListening` is true
        console.log('first')
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          interimTranscript += transcript;
        }
        console.log(interimTranscript)
        setTranscript(interimTranscript);
    };

    // Error handling
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log(event.error)
      if(event.error==='no-speech')
      toast.error("We're having trouble hearing you. Check your microphone settings.")

    };

    // Restart recognition if `isListening` is true
    recognition.onend = () => {
      setIsListening(false)
    };

    // Cleanup on unmount
    return () => {
      recognition.stop();
    };
  }, [recognition]);

  const toggleListening = () => {
    if (recognition && !isLoading) {

      if (isListening) {
        setIsLoading(true)
        recognition.stop();
        setIsListening(false);
        setIsLoading(false)
      } else {
        setIsLoading(true)
        setIsListening(true);
        recognition.start();
        setIsLoading(false)
      }


    }
  };
  return { transcript, isListening, isLoading, toggleListening };
};
