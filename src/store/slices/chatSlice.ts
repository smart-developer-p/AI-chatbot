import { createSlice } from "@reduxjs/toolkit";
import { getChatMessagesById } from "../actions/chatActions";

export type Message = {
  role: "user" | "model";
  text: string;
  timestamp: string;
  id: string;
};

export type Chat = {
  chatId?: string | null;
  loading: boolean;
  botResponseLoading: string;
  messages: Array<Message>;
  isError: boolean;
  errorMessage: string | null;
  currentTypingMessageId: string | null;
};

const initialState: Chat = {
  chatId: null,
  loading: false,
  botResponseLoading: '',
  messages: [],
  isError: false,
  errorMessage: null,
  currentTypingMessageId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setMessages: (state, action) => {
      return { ...state, messages: action.payload };
    },
    addBotMessage: (state, action) => {
      const messageId = `msg-${Date.now()}`; // Generate a unique ID for the message
      const newMessage = {
        ...action.payload?.message,
        id: messageId,
      };
      const newMessages = [...state.messages, newMessage];
      
      return {
        ...state,
        messages: newMessages,
        botResponseLoading: '',
        chatId: action.payload?.conversation_id,
        currentTypingMessageId: messageId, // Set this message as the currently typing one
      };
    },
    addUserMessage: (state, action) => {
      const messageId = `msg-${Date.now()}`;
      state.messages.push({
        ...action.payload,
        id: messageId,
      });
    },
    setBotResponseLoading: (state, action) => {
      return { ...state, botResponseLoading: action.payload };
    },
    setCurrentTypingMessageId: (state, action) => {
      state.currentTypingMessageId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatMessagesById.pending, (state) => {
        if (state.messages.length) {
          return state;
        } else {
          return { ...state, loading: true };
        }
      })
      .addCase(getChatMessagesById.fulfilled, (state, action) => {
        // Add IDs to existing messages if they don't have them
        const messagesWithIds = action.payload.map((msg: Message) => ({
          ...msg,
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
        }));
        return { ...state, loading: false, messages: messagesWithIds };
      })
      .addCase(getChatMessagesById.rejected, (state) => {
        return {
          ...state,
          isError: true,
          loading: false,
          errorMessage: "Something went wrong try again",
        };
      });
  },
});

export const {
  setMessages,
  addBotMessage,
  addUserMessage,
  setBotResponseLoading,
  setCurrentTypingMessageId,
} = chatSlice.actions;
export default chatSlice.reducer;