import { useAuth } from "@/hooks/use-auth";
import { verifyEmail } from "@/services/dispatch/user-dispatch";
import { saveSession, setItem } from "@/services/session";
import { Button, CircularProgress } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcApproval } from "react-icons/fc";
import { MdError } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ActivateAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");
  const { setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleVerifyEmail = useCallback(() => {
    if (!uidb64 || !token) {
      setError("Missing uidb64 or token");
      return;
    }

    setIsLoading(true);
    verifyEmail({ uidb64, token })
      .then((res) => {
        setIsLoading(false);
        setUser(res?.user);
        setIsLoggedIn(true);
        saveSession({
          accessToken: res?.access_token,
          refreshToken: res?.refresh_token,
        });
        setItem("user", res?.user);
        toast.success("Login successful");
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, [navigate, setIsLoggedIn, setUser, token, uidb64]);

  useEffect(() => {
    if (uidb64 && token) {
      handleVerifyEmail();
    }
  }, [handleVerifyEmail, token, uidb64]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {isLoading ? (
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="md:text-3xl">
            Please wait while activating your account
          </h1>
          <CircularProgress size="lg" />
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-col gap-4 items-center justify-center">
              <MdError className="h-20 w-20 font-bold" />
              <h1 className="md:text-3xl">Failed to activate account</h1>
              <Button onClick={() => location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center">
              <FcApproval className="h-20 w-20 font-bold" />
              <h1 className="md:text-3xl">
                Your account is activated successfully
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}