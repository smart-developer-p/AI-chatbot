import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";
import Logo from "@/components/logo";
import DefaultLayout from "@/layouts/default";
import { useAppSelector } from "@/store/hooks";

export default function IndexPage() {
  const chatData = useAppSelector((state) => state.chat);
  return (
    <DefaultLayout>
      <section className="flex flex-col justify-between h-full overflow-hidden">
        {/* chat messages */}
        {chatData?.messages.length ? (
          <ChatMessages data={chatData} />
        ) : (
          <div className="mx-auto my-auto">
            <Logo />
          </div>
        )}

        {/* Chat input container */}
        <ChatInput />
      </section>
    </DefaultLayout>
  );
}
