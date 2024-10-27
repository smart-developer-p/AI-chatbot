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
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current && !isFirstRender) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsFirstRender(false);
  }, [data?.messages]);

  // Update lastMessageIndex when new messages arrive
  useEffect(() => {
    if (data?.messages && data.messages.length > 0) {
      setLastMessageIndex(data.messages.length - 1);
    }
  }, [data?.messages?.length]);

  // Helper function to determine if a message is the latest bot message
  const isLatestBotMessage = (index: number, role: string) => {
    if (!data?.messages) return false;
    
    // If we're currently loading a bot response, no message should show typing effect
    if (data.botResponseLoading) return false;
    
    // Check if this is the last message and it's from the bot
    return index === lastMessageIndex && role === "model";
  };

  return (
    <div className="overflow-auto flex h-full flex-col">
      <Spacer y={24} />

      <div className="w-full lg:w-4/5 flex flex-col mx-auto gap-6 px-4">
        {/* Loading state */}
        {data?.loading ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-default-600">Loading messages...</p>
          </div>
        ) : (
          <>
            {/* Messages */}
            {data?.messages?.map((item, index) => {
              if (item.role === "model") {
                return (
                  <BotMessage 
                    key={`${index}-${item.text.substring(0, 20)}`}
                    message={item}
                    isLatestMessage={isLatestBotMessage(index, item.role)}
                  />
                );
              } else {
                return (
                  <UserMessage 
                    key={`${index}-${item.text.substring(0, 20)}`} 
                    message={item} 
                  />
                );
              }
            })}

            {/* Bot loading state */}
            {data?.botResponseLoading && (
              <div className="self-start flex items-start gap-4">
                <img
                  src="/logo.png"
                  className="h-8 w-8 object-contain rounded-full flex-shrink-0"
                  alt="cerina"
                />
                <div className="bg-default-100 px-4 py-2 rounded-lg text-left animate-pulse">
                  <p className="text-default-600">Analyzing...</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {data?.isError && (
              <div className="self-start flex items-start gap-4">
                <img
                  src="/logo.png"
                  className="h-8 w-8 object-contain rounded-full flex-shrink-0"
                  alt="cerina"
                />
                <div className="bg-danger-100 px-4 py-2 rounded-lg">
                  <p className="text-danger-600">
                    {data?.errorMessage || "An error occurred. Please try again."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef}>
        <Spacer y={10} />
      </div>
    </div>
  );
}