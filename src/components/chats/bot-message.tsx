import { Message } from "@/store/slices/chatSlice";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef, memo } from "react";
import { Button } from "@nextui-org/react";
import { BiCopy, BiCheck } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTypingMessageId } from "@/store/slices/chatSlice";

type P = {
  message: Message;
  onTyping?: Function;
  parentHeight: number;
};

const TypingIndicator = () => (
  <span className="inline-flex ml-1 items-center">
    <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
  </span>
);

const MAX_CODE_HEIGHT = 400;

interface StressButtonProps {
  expanded: boolean,
  setExpanded:Function
}

const StressButton = memo(({ expanded,setExpanded }: StressButtonProps) => {
  return <Button
    size="sm"
    onPointerDown={()=>setExpanded(!expanded) }
    className="bg-default-200 hover:bg-default-300"
  >
    {expanded ? 'Collapse' : 'Expand'}
  </Button>
})

export default function BotMessage(props: P) {
  const { message, onTyping, parentHeight } = props;
  const dispatch = useDispatch();
  const currentTypingMessageId = useSelector((state: any) => state.chat.currentTypingMessageId);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const isCurrentlyTyping = currentTypingMessageId === message.id;

  const scrollLimited = useRef(false);
  const scrollContinRef = useRef<HTMLDivElement>(null);
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const messageTyping = (text: string) => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 20));
        currentIndex += 20;
      } else {
        dispatch(setCurrentTypingMessageId(null));
        clearInterval(typingInterval);
        scrollLimited.current = false;
      }
    }, 30);
  }

  useEffect(() => {
    if (message.text !== newMessage) {
      setNewMessage(message.text);
    }
  }, [message?.text]);


  useEffect(() => {
    if (newMessage !== "") {
      if (!isCurrentlyTyping) {
        setDisplayText(newMessage);
      } else {
        scrollLimited.current = true;
        setDisplayText("");
        messageTyping(newMessage);
      }
    }
  }, [newMessage]);

  useEffect(() => {
    if (scrollContinRef.current) {
      if (scrollContinRef.current?.clientHeight < (parentHeight - 150) || !scrollLimited.current) {
        onTyping && onTyping()
      }
    }
  }, [displayText])

  const TextRenderer = ({ children }: { children: string }) => {
    if (!children) return null;
    return (
      <span>
        {children}
        {isCurrentlyTyping && <TypingIndicator />}
      </span>
    );
  };



  useEffect(() => {
    console.log(isCodeExpanded);
  }, [isCodeExpanded])

  // Guard against undefined message
  if (!message?.text) {
    return null;
  }

  return (
    <div className="self-start flex items-start gap-4 markdown-content w-full">
      <img
        src="/logo.png"
        className="h-8 w-8 object-contain rounded-full flex-shrink-0"
        alt="cerina"
      />
      <div className=" -translate-y-36" ></div>
      <div className="w-full max-w-full overflow-hidden" ref={scrollContinRef}>
        <Markdown
          // key={'markdownstress'}
          className="leading-8"
          remarkPlugins={[[remarkGfm, { singleTilde: false, }],remarkBreaks]}
          // components={{
          //   p({ children }) {
          //     return <TextRenderer>{children as string}</TextRenderer>;
          //   },
          //   code({ className, children, ...rest }) {
          //     const match = /language-(\w+)/.exec(className || "");
          //     const language = match ? match[1] : "";
          //     const code = String(children).replace(/\n$/, "");

          //     if (!match) {
          //       // console.log('???')
          //       return (
          //         <code className="px-1.5 py-0.5 rounded-md bg-default-100 text-default-600" {...rest}>
          //           {children}
          //         </code>
          //       );
          //     }

          //     const codeLines = code.split('\n').length;
          //     const shouldScroll = codeLines > 15;

          //     return (
          //       <div className="w-full my-4 overflow-hidden rounded-lg border border-default-200">
          //         <div className="flex justify-between items-center bg-default-100 py-2 px-4">
          //           <div className="flex items-center gap-2">
          //             <span className="text-sm font-medium text-default-600">{language}</span>
          //             {shouldScroll && (
          //               <span className="text-xs text-default-400">
          //                 {codeLines} lines
          //               </span>
          //             )}
          //           </div>
          //           <div className="flex gap-2">
          //             {shouldScroll && (
          //               <>
                          
          //                 <StressButton expanded={isCodeExpanded} setExpanded={setIsCodeExpanded} />
          //               </>
          //             )}
          //             <Button
          //               size="sm"
          //               variant="flat"
          //               onClick={() => handleCopy(code)}
          //               className="bg-default-200 hover:bg-default-300"
          //             >
          //               {copySuccess ? (
          //                 <div className="flex items-center gap-1">
          //                   <BiCheck className="h-5 w-5" />
          //                   <span>Copied!</span>
          //                 </div>
          //               ) : (
          //                 <div className="flex items-center gap-1">
          //                   <BiCopy className="h-5 w-5" />
          //                   <span>Copy Code</span>
          //                 </div>
          //               )}
          //             </Button>
          //           </div>
          //         </div>
          //         <div
          //           className="overflow-x-auto transition-all duration-300 ease-in-out"
          //           style={{
          //             maxHeight: isCodeExpanded ? 'none' : `${MAX_CODE_HEIGHT}px`,
          //           }}
          //         >
          //           <SyntaxHighlighter
          //             {...(rest as Omit<typeof rest, "ref">)}
          //             PreTag="div"
          //             language={language}
          //             style={vscDarkPlus}
          //             customStyle={{
          //               margin: 0,
          //               borderRadius: 0,
          //               padding: "1.5rem",
          //             }}
          //             showLineNumbers={true}
          //             wrapLines={true}
          //           >
          //             {code}
          //           </SyntaxHighlighter>

          //         </div>
          //         {!isCodeExpanded && shouldScroll && (
          //           <div
          //             className="text-center py-2 bg-default-100 cursor-pointer hover:bg-default-200 transition-colors"
          //             onClick={() => setIsCodeExpanded(true)}
          //           >
          //             <span className="text-sm text-default-600">Click to show more</span>
          //           </div>
          //         )}
          //       </div>
          //     );
          //   },
          // }}
        >
          {displayText || ""}
        </Markdown>
      </div>
    </div>
  );
}
