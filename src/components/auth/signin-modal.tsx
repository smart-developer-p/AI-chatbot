import { useAuth } from "@/hooks/use-auth";
import { login, register, reverifyEmail } from "@/services/dispatch/user-dispatch";
import { saveSession, setItem } from "@/services/session";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useFormik } from "formik";
import {  useState } from "react";
import toast from "react-hot-toast";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import * as Yup from "yup";

type P = {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (message: string) => void;
};

export default function SigninModal({ isOpen, onClose, onSignupSuccess }: P) {
  const [selectedKey, setSelectedKey] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setIsLoggedIn } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);

  const [password, setPassword] = useState("")

  const validationSchemas = {
    login: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email format")
        .matches(
          /@(gmail\.com|outlook\.com|mail\.com|yahoo\.com)$/,
          "Invalid Email. Please Give a Valid Personal Email"
        )
        .required("Email is required"),
      password: Yup.string()
        .min(3, "Password must be at least 3 characters long")
        .required("Password is required"),
    }),
    signup: Yup.object().shape({
      full_name: Yup.string()
        .min(3, "Full name must be at least 3 characters long")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .matches(
          /@(gmail\.com|outlook\.com|mail\.com|yahoo\.com)$/,
          "Invalid Email. Please Give a Valid Personal Email"
        )
        .required("Email is required"),
      // password: Yup.string()
      //   .min(3, "Password must be at least 3 characters long")
      //   .required("Password is required"),
    }),
  };

  const handleResendVerification = async (email:string=unverifiedEmail||'') => {
    if (!email) return;

    setResendingEmail(true);
    try {
      await reverifyEmail({ email });
      toast.success("Verification email has been resent. Please check your inbox.");
      setShowVerificationModal(true);
    } catch (err) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setResendingEmail(false);
    }
  };

  // Enhanced error handling function
  const handleApiError = (err: any, context: 'login' | 'signup') => {
    setLoading(false);

    if (!err.response) {
      setError("Network error. Please check your connection and try again.");
      return;
    }

    const { status, data } = err.response;

    // Handle email-specific error messages
    if (data?.email?.[0]) {
      const emailError = data.email[0];

      // Handle verified user case
      if (emailError.includes("already exists and is verified")) {
        setError("This email is already registered. Please login instead.");
        setTimeout(() => setSelectedKey("login"), 1500);
        return;
      }

      // Handle unverified user case
      if (emailError.includes("already registered but not verified")) {
        setUnverifiedEmail(formik.values.email);
        setError("This email is registered but not verified. Click below to resend verification email.");
        return;
      }

      // Handle any other email-specific errors
      setError(emailError);
      return;
    }

    switch (status) {
      case 400:
        if (context === 'login' && data?.detail?.includes("not found")) {
          setError("Email not registered. Please sign up first.");
          setTimeout(() => setSelectedKey("signup"), 1500);
          return;
        }
        setError(data.message || "Please check your input and try again.");
        break;
      case 401:
        setError("Incorrect email or password. Please try again.");
        break;
      case 422:
        setError("Invalid input format. Please check your details.");
        break;
      case 429:
        setError("Too many attempts. Please try again later.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
    }

    console.error("API Error:", {
      status,
      data,
      context,
      error: err
    });
  };

  const formik = useFormik({
    initialValues:
      selectedKey === "login"
        ? { email: "", password: "" }
        : { full_name: "", email: "", password: "" },
    validationSchema:
      selectedKey === "login"
        ? validationSchemas.login
        : validationSchemas.signup,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        if (selectedKey === "login") {
          const res = await login(values);
          if (res?.user) {
            setUser(res.user);
            setIsLoggedIn(true);
            saveSession({
              accessToken: res.access,
              refreshToken: res.refresh,
            });
            setItem("user", res.user);
            toast.success("Login successful");
            onClose();
          } else {
            throw new Error("Invalid response format");
          }
        } else {
           await register(values);
          setLoading(false);
          setShowVerificationModal(true);
          onSignupSuccess("Registration successful! Please verify your email.");
          onClose();
        }
      } catch (err: any) {
        handleApiError(err, selectedKey as 'login' | 'signup');
      }
    },
  });

  const { getFieldProps, handleSubmit, errors, touched } = formik;



  function hasLetter() {
    return /[a-zA-Z]/.test(password);
  }

  function hasNumber() {
    return /[0-9]/.test(password);
  }

  function hasMinimumLength() {
    return password.length >= 8;
  }

  function strongPassword() {
    let sum = (hasLetter() ? 1 : 0) + (hasNumber() ? 1 : 0) + (hasMinimumLength() ? 1 : 0);

    return 100 * (sum / 3)

  }




  return (
    <>
      {/* Sign-in/Sign-up Modal */}
      <Modal
        isOpen={isOpen}

        hideCloseButton
        className="backdrop-blur-sm"
      >
        <ModalContent>
          <ModalHeader>
            <Tabs
              fullWidth
              aria-label="Options"
              selectedKey={selectedKey}
              onSelectionChange={(key)=>{
                setSelectedKey(key as string )
                setPassword('')
              }  }
              color="primary"
              radius="lg"
              size="lg"
            >
              <Tab key="login" title="Login" className="text-lg py-6" />
              <Tab key="signup" title="Sign Up" className="text-lg py-6" />
            </Tabs>
          </ModalHeader>
          <ModalBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {selectedKey === "signup" && (
                <Input
                  placeholder="Full Name"
                  size="lg"
                  {...getFieldProps("full_name")}
                  isInvalid={touched.full_name && errors.full_name ? true : false}
                  errorMessage={errors.full_name}
                />
              )}
              <Input
                placeholder="Email"
                size="lg"
                {...getFieldProps("email")}
                isInvalid={touched.email && errors.email ? true : false}
                errorMessage={errors.email}
              />
              <Input
                placeholder="Password"
                size="lg"
                type="password"
                {...getFieldProps("password")}
                onChange={e => {
                  getFieldProps("password").onChange(e)
                  setPassword(e.target.value)
                }}
                isInvalid={touched.password && errors.password ? true : false}
                errorMessage={errors.password}
              />
              
              {selectedKey === 'signup' && <div className=" px-2" >
                <div className="w-full flex justify-between" >
                  <div className=" text-warning-500" >Weak</div>
                  <div className=" text-success-500" >Strong</div>
                </div>
                <Progress
                  size="sm"
                  radius="sm"
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-yellow-500 via-orange-500 to-green-500",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                  value={strongPassword()}
                />
                <div className={`flex items-center text-sm ${hasLetter() ? 'text-success-500' : 'text-danger-500'} `} >{hasLetter() ? <IoCheckmarkOutline /> : <IoCloseOutline />}&nbsp;Must contain at least one letter (lower or upper case)</div>
                <div className={`flex items-center text-sm ${hasNumber() ? 'text-success-500' : 'text-danger-500'} `} >{hasNumber() ? <IoCheckmarkOutline /> : <IoCloseOutline />}&nbsp;Must contain at least one number</div>
                <div className={`flex items-center text-sm ${hasMinimumLength() ? 'text-success-500' : 'text-danger-500'} `} >{hasMinimumLength() ? <IoCheckmarkOutline /> : <IoCloseOutline />}&nbsp;Must contain a minimum of 8 characters</div>

              </div>}
              {error && (
                <p className="text-danger text-sm font-medium px-2">{error}</p>
              )}



              {unverifiedEmail && (
                <Button
                  size="lg"
                  color="secondary"
                  onClick={()=> handleResendVerification()}
                  isLoading={resendingEmail}
                >
                  Resend Verification Email
                </Button>
              )}
              <Button size="lg" color="primary" type="submit" isLoading={loading}>
                {selectedKey === "login" ? "Let's Go" : "Join Now"}
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Verification Modal */}
      {showVerificationModal && (
        <Modal
          isOpen={showVerificationModal}
          // onClose={() => setShowVerificationModal(false)}
          className="backdrop-blur-xl"
          size="lg"
        >
          <ModalContent className="w-[80%] mx-auto p-8 rounded-lg shadow-lg">
            <ModalHeader>
              <h2 className="text-3xl font-bold">Check Your Email</h2>
            </ModalHeader>
            <ModalBody>
              <p>Please check your email and click the verification link to activate your account.</p>
            </ModalBody>
            <ModalFooter>
              <div className="w-full max-sm:block flex justify-between " >


              <Button size="lg" color="warning" className="w-1/3 max-sm:w-full m-1" onClick={()=>handleResendVerification(formik.values['email'])}>
                Resend 
              </Button>
              <Button size="lg" color="primary" className="w-1/3 max-sm:w-full m-1" onClick={() => window.open("https://mail.google.com", "_blank")}>
                Open Email
              </Button>
              <Button size="lg" color="default" className="w-1/3 max-sm:w-full m-1" onClick={() => setShowVerificationModal(false)}>
                Close
              </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}