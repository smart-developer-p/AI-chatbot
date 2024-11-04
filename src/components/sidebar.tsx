import { Button } from "@nextui-org/react";
import { BsChatLeftDots,BsLayoutSidebar } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import ChatList from "./chats/chat-list";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setMessages } from "@/store/slices/chatSlice";

const SigninModal = lazy(() => import("@/components/auth/signin-modal"));

type P = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: P) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (window.innerWidth < 768) onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`p-0`}>
      <div
        ref={sidebarRef}
        className={`
           z-50
            overflow-hidden
          fixed md:relative left-0 top-0 h-full
          bg-background/80 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${isSigninOpen || !isLoggedIn ? "blur" : ""}
          ${isOpen 
            ? "w-64  md:w-72  visible" 
            : "w-0 invisible"}
          flex flex-col
          border-r border-divider/20
          shadow-lg 
        `}
      >
        {!loading && (
          <div className="flex flex-col h-full">
            {/* Top Section */}
            <div className="p-3 pt-4 flex gap-2">
              <Button isIconOnly onClick={onClose} className=" h-11 w-14  aspect-square ">
                  <BsLayoutSidebar className="h-4 w-4" />
                </Button>
              <Button
                radius="lg"
                className="justify-start gap-2 w-full h-11 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-200"
                onClick={() => {
                  navigate("/");
                  dispatch(setMessages([]));
                }}
              >
                <BsChatLeftDots className="h-5 w-5 text-primary" />
                <span className="font-medium">New Chat</span>
              </Button>
                
            </div>

            {/* Chat List Section */}
            <div 
              className="flex-1 px-2 overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all duration-300"
              style={{
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
              }}
            >

              <ChatList />
            </div>

            {/* Bottom Section */}
            <div className="p-3 border-t border-divider/20 flex flex-col gap-2.5 bg-background/50 backdrop-blur-sm">
              {isLoggedIn ? (
                <Button
                  radius="lg"
                  color="primary"
                  className="justify-start w-full h-11 font-medium shadow-sm"
                  variant="shadow"
                >
                  Upgrade to Pro
                </Button>
              ) : (
                <Button
                  radius="lg"
                  color="primary"
                  className="justify-start w-full h-11 font-medium shadow-sm"
                  variant="shadow"
                  onClick={() => setIsSigninOpen(true)}
                >
                  Login / Sign Up
                </Button>
              )}
              
              <Button
                radius="lg"
                variant="light"
                className="justify-start gap-2 w-full h-11 text-default-600 hover:text-default-900"
                onClick={()=>navigate('/setting')}
              >
                <CiSettings className="h-5 w-5" />
                Settings
              </Button>
            </div>
          </div>
        )}
      </div>

      <Suspense>
        <SigninModal
          isOpen={isSigninOpen}
          onClose={() => setIsSigninOpen(false)}
          onSignupSuccess={() => {}}
        />
      </Suspense>
    </div>
  );
}