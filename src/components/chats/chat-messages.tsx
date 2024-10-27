import { Chat } from "@/store/slices/chatSlice";
import { useEffect, useRef, useState } from "react";
import BotMessage from "./bot-message";
import UserMessage from "./user-message";
import { Spacer } from "@nextui-org/react";

type P = {
  data: Chat;
};

export default function ChatMessages(props: P) {
  const { data } = props;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [lastMessageIndex, setLastMessageIndex] = useState(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  useEffect(() => {
    // Update lastMessageIndex when new messages arrive
    if (data?.messages && data.messages.length > 0) {
      setLastMessageIndex(data.messages.length - 1);
    }
  }, [data?.messages?.length]);

  return (
    <div className="overflow-auto flex h-full flex-col ">
      <Spacer y={24} />

      <div className="w-full lg:w-4/5 flex flex-col mx-auto gap-6">
        {/* Loading ui */}
        {data?.loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Messages */}
            {data?.messages?.map((item, index) => {
              if (item.role === "model") {
                return (
                  <BotMessage 
                    key={index}
                    message={{
                      ...item,
                      // Only show typing effect for the latest bot message
                      showTypingEffect: index === lastMessageIndex && item.role === "model"
                    }}
                  />
                );
              } else {
                return <UserMessage key={index} message={item} />;
              }
            })}

            {/* Bot loading ui */}
            {data?.botResponseLoading && (
              <div className="bg-default w-fit px-2 rounded-lg text-left animate-pulse self-start">
                <p>Analyzing...</p>
              </div>
            )}

            {/* Error ui */}
            {data?.isError && (
              <div className="bg-default w-fit p-1 rounded-lg">
                <p>{data?.errorMessage}</p>
              </div>
            )}
          </>
        )}
      </div>

      <Spacer y={10} ref={bottomRef} />
    </div>
  );
}