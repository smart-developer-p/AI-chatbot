import { useEffect, useState } from "react";
import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";
import Logo from "@/components/logo";
import DefaultLayout from "@/layouts/default";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/use-auth";
import { lazy, Suspense } from "react";

// Lazy load the SigninModal component
const SigninModal = lazy(() => import("@/components/auth/signin-modal"));

export default function IndexPage() {
  const chatData = useAppSelector((state) => state.chat);
  const { isLoggedIn } = useAuth(); // Use the login state
  const [isSigninOpen, setIsSigninOpen] = useState(!isLoggedIn); // Open modal if not logged in
  const [signupMessage, setSignupMessage] = useState(""); // State to hold success message

  useEffect(() => {
    if (!isLoggedIn) {
      setIsSigninOpen(true); // Ensure modal remains open until login/signup
    } else {
      setIsSigninOpen(false); // Close modal if the user is already logged in
    }
  }, [isLoggedIn]);

  return (
    <DefaultLayout>
      {/* Apply blur only to the main content when the modal is open */}
      <section
        className={`flex flex-col justify-between h-full overflow-hidden ${
          isSigninOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Chat messages */}
        {chatData?.messages.length ? (
          <ChatMessages data={chatData} />
        ) : (
          <div className="mx-auto my-auto">
            <Logo />
          </div>
        )}
        {/* Chat input container */}
        <ChatInput />
      </section>

      {/* Display signup success message */}
      {signupMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {signupMessage}
        </div>
      )}

      {/* Sign-in modal */}
      <Suspense fallback={<div>Loading...</div>}>
        {!isLoggedIn && (
          <SigninModal
            isOpen={isSigninOpen}
            onClose={() => setIsSigninOpen(false)}
            onSignupSuccess={(message) => setSignupMessage(message)}
          />
        )}
      </Suspense>
    </DefaultLayout>
  );
}
