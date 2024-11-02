import { Chat } from "@/store/slices/chatSlice";
import { useEffect, useRef, useState } from "react";
import BotMessage from "./bot-message";
import UserMessage from "./user-message";
import { Spacer } from "@nextui-org/react";
import { AiOutlineArrowDown } from "react-icons/ai";

type P = {
  data: Chat;
};

export default function ChatMessages(props: P) {
  const { data } = props;
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isFirstRender, setIsFirstRender] = useState(true);
  const containRef = useRef<HTMLDivElement>(null);
  const scrollButton = useRef<HTMLButtonElement>(null);

  const handleScrollDwon = () => {
    if (containRef.current) {
      containRef.current.scrollTo({
        left: 0,
        top: containRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if (!isFirstRender) {
      handleScrollDwon()
    }
    setIsFirstRender(false);
  }, [data?.messages]);

  useEffect(() => {
    let interval: any;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === bottomRef.current && scrollButton.current) {
            if (interval)
              clearTimeout(interval);
            if (scrollButton.current.hidden) {
              interval = setTimeout(() => {
                if (scrollButton.current)
                  scrollButton.current.hidden = entry.isIntersecting;
              }, 600)
            } else {
              scrollButton.current.hidden = entry.isIntersecting;
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, []);


  return (
    <>
      <div ref={containRef} className="overflow-auto flex h-full flex-col relative">
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
                      onTyping={handleScrollDwon}
                      key={index}
                      message={item}
                      parentHeight={containRef.current?.clientHeight || document.body.clientHeight}
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
        <div >
          <Spacer y={10} />
        </div>
        <div className="relative p-2" ref={bottomRef}></div>
      </div>
      <button ref={scrollButton} onClick={handleScrollDwon} className="absolute left-1/2 bottom-16 p-3 rounded-full bg-default "><AiOutlineArrowDown /></button>
    </>
  );
}