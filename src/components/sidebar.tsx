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

// Lazy load the SigninModal component
const SigninModal = lazy(() => import("@/components/auth/signin-modal"));

type P = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: P) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const { loading, isLoggedIn } = useAuth(); // Fetch login state
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Close the sidebar when clicked outside (for small screens)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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
          className={`z-50 h-full bg-background transition-all duration-200 ease-in-out ${
            isSigninOpen || !isLoggedIn ? "blur" : "" // Apply blur only if modal is open or user is not logged in
          } ${
            isOpen
              ? "w-52 min-w-52 max-w-52 md:min-w-80 md:w-80 md:max-w-80 visible "
              : "w-0 invisible "
          } overflow-x-hidden flex flex-col gap-4 rounded-md shadow-custom absolute top-0 left-0 sm:relative`}
        >
          {loading ? (
            ""
          ) : (
            <div className="p-4 flex flex-col gap-2 justify-between h-full">
              <div className="flex flex-col gap-2">
{/*                 <ServicesSidebarBtn /> */}
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

              {/* If user is logged in, show plan upgrade; else, show login button */}
              {isLoggedIn ? (
                <>
                  <Button radius="sm" color="primary" className="font-bold">
                    Upgrade Plan
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    radius="sm"
                    color="primary"
                    onClick={() => setIsSigninOpen(true)} // Open Sign-in modal
                    className="font-bold"
                  >
                    Login / Sign Up
                  </Button>
                </div>
              )}

              <Button radius="sm" className="font-bold">
                <CiSettings className="h-6 w-6" /> Settings
              </Button>
            </div>
          )}
        </div>

        {/* Lazy load and show Sign-in Modal */}
        <Suspense>
          <SigninModal
            isOpen={isSigninOpen}
            onClose={() => setIsSigninOpen(false)} // Close modal when needed
            onSignupSuccess={() => {}}
          />
        </Suspense>
      </div>
    </>
  );
}
