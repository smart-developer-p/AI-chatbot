import { deleteService, getService, postService } from "../service";

// Start new chat
export const newChat = async (param: unknown) => {
  const { data } = await postService("/chat/", param);
  return data;
};

// Get chat details
export const getChatMessages = async (conversationId: string) => {
  const { data } = await getService(`/chat/${conversationId}/`);
  return data;
};

export const deleteChatHistory= async(conversationId:string)=>{
  const { data } = await deleteService(`/chat/delete/${conversationId}/`);
  return data;
}

// Chat with existing conversation
export const chatWithExistingConversation = async ({
  conversationId,
  formdata,
}: {
  conversationId: string;
  formdata: unknown;
}) => {
  const { data } = await postService(`/chat/${conversationId}/`, formdata);
  return data;
};

// Get all conversations
export const getChatHistory = async () => {
  const { data } = await getService("/conversations/");
  return data;
};
