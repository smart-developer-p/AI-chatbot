import { Chat } from "@/store/slices/chatSlice";
import { useEffect, useRef } from "react";
import BotMessage from "./bot-message";
import UserMessage from "./user-message";
import { Spacer } from "@nextui-org/react";

type P = {
  data: Chat;
};

export default function ChatMessages(props: P) {
  const { data } = props;
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when the data changes (new message received)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Sort messages by timestamp in descending order (most recent first)
  const sortedMessages = data?.messages?.slice().sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="overflow-auto flex h-full flex-col">
      <Spacer y={24} />

      <div className="w-full lg:w-4/5 flex flex-col mx-auto gap-6">
        {/* Loading UI */}
        {data?.loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Render sorted messages */}
            {sortedMessages?.map((item) => {
              if (item.role === "model") {
                return <BotMessage key={item.id} message={item} />;
              } else {
                return <UserMessage key={item.id} message={item} />;
              }
            })}

            {/* Bot loading UI */}
            {data?.botResponseLoading && (
              <div className="bg-default w-fit px-2 rounded-lg text-left animate-pulse self-start">
                <p>Analyzing...</p>
              </div>
            )}

            {/* Error UI */}
            {data?.isError && (
              <div className="bg-default w-fit p-1 rounded-lg">
                <p>{data?.errorMessage}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Spacer at the bottom for smooth scrolling */}
      <Spacer y={10} ref={bottomRef} />
    </div>
  );
}
