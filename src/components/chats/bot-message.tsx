import { Message } from "@/store/slices/chatSlice";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { BiCopy, BiCheck } from "react-icons/bi";

type P = {
  message: Message & {
    showTypingEffect?: boolean; // Add new optional property
  };
};

const TypingIndicator = () => (
  <span className="inline-flex ml-1 items-center">
    <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
  </span>
);

export default function BotMessage(props: P) {
  const { message } = props;
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(message.showTypingEffect ?? false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Custom renderer for text content to add typing indicator
  const TextRenderer = ({ children }: { children: string }) => {
    if (!children) return null;
    
    // Only show typing animation if showTypingEffect is true
    if (!message.showTypingEffect) {
      return <span>{message.text}</span>;
    }
    
    return (
      <span>
        {children}
        {isTyping && <TypingIndicator />}
      </span>
    );
  };

  useEffect(() => {
    // Only run typing effect if showTypingEffect is true
    if (!message.showTypingEffect) {
      setDisplayText(message.text);
      setIsTyping(false);
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
  }, [currentIndex, message.text, message.showTypingEffect]);

  return (
    <div className="self-start flex items-start gap-2 markdown-content">
      <img
        src="/logo.png"
        className="h-8 w-8 object-contain rounded-full"
        alt="cerina"
      />
      <div>
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
              return match ? (
                <div className="relative max-w-[70%]">
                  <div className="flex justify-between items-center bg-default mt-4 py-1 px-2 rounded-t-md">
                    <span className="text-sm font-medium">{language}</span>
                    <Button size="sm" onClick={() => handleCopy(code)}>
                      {copySuccess ? (
                        <>
                          <BiCheck className="h-6 w-6" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <BiCopy className="h-6 w-6" /> Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    {...(rest as Omit<typeof rest, "ref">)}
                    PreTag="div"
                    language={language}
                    style={vscDarkPlus}
                    className="rounded-b-md"
                    codeTagProps={{ className: "" }}
                    customStyle={{
                      margin: "0 0 1rem",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="inline-code" {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {displayText}
        </Markdown>
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
        `}</style>
      </div>
    </div>
  );
}