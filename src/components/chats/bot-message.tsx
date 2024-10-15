import { Message } from "@/store/slices/chatSlice";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { BiCopy, BiCheck } from "react-icons/bi";

type P = {
  message: Message;
};

export default function BotMessage(props: P) {
  const { message } = props;
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="self-start flex items-start gap-2 markdown-content">
      <img
        src="/logo.png"
        className="h-8 w-8 object-contain rounded-full"
        alt="cerina"
      />
      <Markdown
        className="leading-8"
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
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
                  // wrapLongLines
                  // wrapLongLines
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
              <>{children}</>
            );
          },
        }}
      >
        {message.text}
      </Markdown>
    </div>
  );
}
