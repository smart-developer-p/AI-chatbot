import { getChatMessages } from "@/services/dispatch/chat-dispatch";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Message } from "../slices/chatSlice";

// Get chat messages by converstaion id
export const getChatMessagesById = createAsyncThunk<Array<Message>, string>(
  "/chat/messagesById",
  async (id: string, thunkAPI) => {
    try {
      const res = await getChatMessages(id);
      return res?.messages;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
