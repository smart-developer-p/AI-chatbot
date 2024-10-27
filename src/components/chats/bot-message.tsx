import { Message } from "@/store/slices/chatSlice";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";
import { BiCopy, BiCheck } from "react-icons/bi";

type P = {
  message: Message & {
    showTypingEffect?: boolean;
  };
  isLatestMessage: boolean; // New prop to determine if this is the latest message
};

const TypingIndicator = () => (
  <span className="inline-flex ml-1 items-center">
    <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
  </span>
);

const MAX_CODE_HEIGHT = 400; // Maximum height for code blocks in pixels

export default function BotMessage(props: P) {
  const { message, isLatestMessage } = props;
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  
  // Ref to track if the component is mounted
  const isMounted = useRef(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const TextRenderer = ({ children }: { children: string }) => {
    if (!children) return null;
    
    return (
      <span>
        {children}
        {isTyping && <TypingIndicator />}
      </span>
    );
  };

  // Initialize component
  useEffect(() => {
    isMounted.current = true;
    
    // Only show typing effect for the latest message when it's first added
    if (isLatestMessage && !isMounted.current) {
      setDisplayText("");
      setCurrentIndex(0);
      setIsTyping(true);
    } else {
      setDisplayText(message.text);
      setIsTyping(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle typing effect
  useEffect(() => {
    if (!isLatestMessage || !isTyping) {
      return;
    }

    if (currentIndex < message.text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + message.text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, message.text, isLatestMessage, isTyping]);

  return (
    <div className="self-start flex items-start gap-4 markdown-content w-full">
      <img
        src="/logo.png"
        className="h-8 w-8 object-contain rounded-full flex-shrink-0"
        alt="cerina"
      />
      <div className="w-full max-w-full overflow-hidden">
        <Markdown
          className="leading-8"
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
          components={{
            p({ children }) {
              return <TextRenderer>{children as string}</TextRenderer>;
            },
            code({ className, children, ...rest }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");
              
              if (!match) {
                return (
                  <code className="px-1.5 py-0.5 rounded-md bg-default-100 text-default-600" {...rest}>
                    {children}
                  </code>
                );
              }

              const codeLines = code.split('\n').length;
              const shouldScroll = codeLines > 15; // Show expand button if more than 15 lines
              
              return (
                <div className="w-full my-4 overflow-hidden rounded-lg border border-default-200">
                  <div className="flex justify-between items-center bg-default-100 py-2 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-default-600">{language}</span>
                      {shouldScroll && (
                        <span className="text-xs text-default-400">
                          {codeLines} lines
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {shouldScroll && (
                        <Button 
                          size="sm" 
                          variant="flat"
                          onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                          className="bg-default-200 hover:bg-default-300"
                        >
                          {isCodeExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="flat"
                        onClick={() => handleCopy(code)}
                        className="bg-default-200 hover:bg-default-300"
                      >
                        {copySuccess ? (
                          <div className="flex items-center gap-1">
                            <BiCheck className="h-5 w-5" />
                            <span>Copied!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <BiCopy className="h-5 w-5" />
                            <span>Copy Code</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div 
                    className={`overflow-x-auto transition-all duration-300 ease-in-out`}
                    style={{
                      maxHeight: isCodeExpanded ? 'none' : `${MAX_CODE_HEIGHT}px`,
                    }}
                  >
                    <SyntaxHighlighter
                      {...(rest as Omit<typeof rest, "ref">)}
                      PreTag="div"
                      language={language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        padding: "1.5rem",
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                  {!isCodeExpanded && shouldScroll && (
                    <div 
                      className="text-center py-2 bg-default-100 cursor-pointer hover:bg-default-200 transition-colors"
                      onClick={() => setIsCodeExpanded(true)}
                    >
                      <span className="text-sm text-default-600">Click to show more</span>
                    </div>
                  )}
                </div>
              );
            },
          }}
        >
          {isLatestMessage ? displayText : message.text}
        </Markdown>
      </div>
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .markdown-content pre {
          margin: 0 !important;
          background: transparent !important;
        }
        .markdown-content pre code {
          background: transparent !important;
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
}