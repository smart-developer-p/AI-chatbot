import { createSlice } from "@reduxjs/toolkit";
import { getChatMessagesById } from "../actions/chatActions";

export type Message = {
  role: "user" | "model";
  text: string;
  timestamp: string;
};

export type Chat = {
  chatId?: string | null;
  loading: boolean;
  botResponseLoading: boolean;
  messages: Array<Message>;
  isError: boolean;
  errorMessage: string | null;
};

const initialState: Chat = {
  chatId: null,
  loading: false,
  botResponseLoading: false,
  messages: [],
  isError: false,
  errorMessage: null,
};
const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setMessages: (state, action) => {
      return { ...state, messages: action.payload };
    },
    addBotMessage: (state, action) => {
      const newMessages = [...state.messages, action.payload?.message];
      return {
        ...state,
        messages: newMessages,
        botResponseLoading: false,
        chatId: action.payload?.conversation_id,
      };
    },
    addUserMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setBotResponseLoading: (state, action) => {
      return { ...state, botResponseLoading: action.payload };
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
        return { ...state, loading: false, messages: action?.payload };
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
} = chatSlice.actions;
export default chatSlice.reducer;
