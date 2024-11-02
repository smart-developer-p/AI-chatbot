import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";
import DefaultLayout from "@/layouts/default";
import { getChatMessagesById } from "@/store/actions/chatActions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { id } = useParams();
  const chatData = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getChatMessagesById(id!));
  }, [dispatch, id]);

  return (
    <DefaultLayout>
      <section className="flex flex-col justify-between h-full overflow-hidden">
        {/* chat messages */}

        <ChatMessages data={chatData} />

        {/* Chat input container */}
        <ChatInput />
      </section>
    </DefaultLayout>
  );
}
