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
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (bottomRef.current && !isFirstRender) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsFirstRender(false);
  }, [data?.messages]);

  return (
    <div className="overflow-auto flex h-full flex-col">
      <Spacer y={24} />
      <div className="w-full lg:w-4/5 flex flex-col mx-auto gap-6 px-4">
        {data?.loading ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-default-600">Loading messages...</p>
          </div>
        ) : (
          <>
            {data?.messages?.map((item, index) => {
              if (item.role === "model") {
                return (
                  <BotMessage
                    key={index}
                    message={item}
                  />
                );
              } else {
                return (
                  <UserMessage
                    key={index}
                    message={item}
                  />
                );
              }
            })}
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
      <div ref={bottomRef}>
        <Spacer y={10} />
      </div>
    </div>
  );
}