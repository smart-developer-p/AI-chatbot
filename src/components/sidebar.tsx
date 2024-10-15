import { Button, Progress } from "@nextui-org/react";
import { BsChatLeftDots } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import ChatList from "./chats/chat-list";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import ServicesSidebarBtn from "./services/services-sidebar-btn";
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
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (window.screen.width < 768) onClose();
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
    <>
      <div className={`${isOpen ? "pl-4 py-4" : "p-0"}`}>
        <div
          ref={sidebarRef}
          className={`z-50 h-full bg-background ${
            isOpen
              ? "w-52 min-w-52 max-w-52 md:min-w-80 md:w-80 md:max-w-80 visible "
              : "w-0 invisible "
          } overflow-x-hidden transition-all duration-100 flex flex-col gap-4 rounded-md shadow-custom ease-in-out absolute top-0 left-0 sm:relative`}
        >
          {loading ? (
            ""
          ) : (
            <div className="p-4 flex flex-col gap-2 justify-between h-full">
              <div className="flex flex-col gap-2">
                <ServicesSidebarBtn />
                <Button
                  radius="sm"
                  onClick={() => {
                    navigate("/");
                    dispatch(setMessages([]));
                  }}
                >
                  <BsChatLeftDots className="h-6 w-6" /> New Chat
                </Button>
              </div>
              {/* Chat list */}
              <ChatList />

              {/* Loign, settings and plan upgrade */}
              {isLoggedIn ? (
                <>
                  <Button radius="sm" color="primary" className="font-bold">
                    Upgrade Plan
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Free limit */}
                  <div className="flex flex-col gap-1 items-center">
                    <p>4/5 Free Generations</p>
                    <Progress value={4} maxValue={5} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      radius="sm"
                      color="primary"
                      onClick={() => setIsSigninOpen(true)}
                      className="font-bold"
                    >
                      Login / Sign Up
                    </Button>
                  </div>
                </div>
              )}

              <Button radius="sm" className="font-bold">
                <CiSettings className="h-6 w-6" /> Settings
              </Button>
            </div>
          )}
        </div>
        <Suspense>
          <SigninModal
            isOpen={isSigninOpen}
            onClose={() => setIsSigninOpen(false)}
          />
        </Suspense>
      </div>
    </>
  );
}
