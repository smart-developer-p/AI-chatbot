import { useAuth } from "@/hooks/use-auth";
import { login, register } from "@/services/dispatch/user-dispatch";
import { saveSession, setItem } from "@/services/session";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { Key, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";

type P = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SigninModal({ isOpen, onClose }: P) {
  const [selectedKey, setSelectedKey] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setIsLoggedIn } = useAuth();

  const validationSchemas = {
    login: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email format")
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
        .required("Email is required"),
      password: Yup.string()
        .min(3, "Password must be at least 3 characters long")
        .required("Password is required"),
    }),
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
    onSubmit: (values) => {
      setLoading(true);
      setError(null);

      const handleError = (err: any) => {
        setLoading(false);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 400) {
            setError(err.response.data.message || "Invalid input. Please check your details.");
          } else if (err.response.status === 401) {
            setError("Invalid credentials. Please try again.");
          } else if (err.response.status === 409) {
            setError("This email is already registered. Please login or use a different email.");
          } else {
            setError(`Server error: ${err.response.data.message || "An unexpected error occurred."}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from server. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error:", err);
      };

      if (selectedKey === "login") {
        login(values)
          .then((res) => {
            setUser(res?.user);
            setIsLoggedIn(true);
            setLoading(false);
            saveSession({
              accessToken: res?.access,
              refreshToken: res?.refresh,
            });
            setItem("user", res?.user);
            toast.success(res?.message || "Login successful");
            onClose();
          })
          .catch(handleError);
      } else {
        register(values)
          .then((res) => {
            setLoading(false);
            toast.success(res?.message || "SignUp successful. Please check your email to verify your account.");
            onClose();
          })
          .catch(handleError);
      }
    },
  });

  const { getFieldProps, handleSubmit, resetForm, errors, touched } = formik;

  const handleTabChange = (key: Key) => {
    setSelectedKey(key as "login" | "signup");
    setError(null);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader>
          <Tabs
            fullWidth
            aria-label="Options"
            selectedKey={selectedKey}
            onSelectionChange={handleTabChange}
            color="primary"
            radius="lg"
            size="lg"
          >
            <Tab key="login" title="Login" className="text-lg py-6" />
            <Tab key="signup" title="SignUp" className="text-lg py-6" />
          </Tabs>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
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
              type="password"
              size="lg"
              {...getFieldProps("password")}
              isInvalid={touched.password && errors.password ? true : false}
              errorMessage={errors.password}
            />
            <Button size="lg" color="primary" type="submit" isLoading={loading}>
              {selectedKey === "login" ? "Let's Go" : "Join Now"}
            </Button>
          </form>
        </ModalBody>
        <ModalFooter className="flex-col gap-4">
          {selectedKey === "login" ? (
            <p
              className="mx-auto cursor-pointer"
              onClick={() => handleTabChange("signup")}
            >
              Don't have an account?
              <span className="text-primary font-bold"> SignUp</span>
            </p>
          ) : (
            <p
              className="mx-auto cursor-pointer"
              onClick={() => handleTabChange("login")}
            >
              Already have an account!
              <span className="text-primary font-bold"> Login</span>
            </p>
          )}
          <Button size="lg" variant="bordered">
            <FcGoogle className="h-6 w-6" /> Continue with Google
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}