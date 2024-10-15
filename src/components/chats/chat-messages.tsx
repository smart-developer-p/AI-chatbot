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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // if (data?.loading) {
  //   return <p>Loading...</p>;
  // }
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
            {data?.messages?.map((item) => {
              if (item.role === "model") {
                return <BotMessage message={item} />;
              } else {
                return <UserMessage message={item} />;
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
