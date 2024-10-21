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
  onSignupSuccess: (message: string) => void;
};

export default function SigninModal({ isOpen, onClose, onSignupSuccess }: P) {
  const [selectedKey, setSelectedKey] = useState("login");
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For verification modal

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
      if (selectedKey === "login") {
        login(values)
          .then((res) => {
            setUser(res?.user);
            setIsLoggedIn(true); // Set login state to true
            saveSession({
              accessToken: res?.access,
              refreshToken: res?.refresh,
            });
            setItem("user", res?.user);
            toast.success("Login successful");
            onClose(); // Close modal on success
          })
          .catch((err) => {
            toast.error("Login failed. Please try again.");
            setLoading(false);
          });
      } else {
        register(values)
          .then(() => {
            setLoading(false);
            const successMessage ="";
            setShowVerificationModal(true); // Show verification modal on success
            onSignupSuccess(successMessage);
            onClose(); // Close the signup modal
          })
          .catch((err) => {
            toast.error("Signup failed. Please try again.");
            setLoading(false);
          });
      }
    },
  });

  const { getFieldProps, handleSubmit, resetForm, errors, touched } = formik;

  return (
    <>
      {/* Sign-in/Sign-up Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
        }}
        hideCloseButton
        className="backdrop-blur-sm"
      >
        <ModalContent>
          <ModalHeader>
            <Tabs
              fullWidth
              aria-label="Options"
              selectedKey={selectedKey}
              onSelectionChange={setSelectedKey as (key: Key) => void}
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
                {...getFieldProps("password")}
                isInvalid={touched.password && errors.password ? true : false}
                errorMessage={errors.password}
              />
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
          onClose={() => setShowVerificationModal(false)}
          className="backdrop-blur-xl" // Stronger blur for verification
          size="lg"
        >
          <ModalContent className="w-[80%] mx-auto p-8 rounded-lg shadow-lg">
            <ModalHeader>
              <h2 className="text-3xl font-bold">Verify your email address</h2>
            </ModalHeader>
            <ModalBody>
              <p>Please click the button below to confirm your email address and activate your account.</p>
            </ModalBody>
            <ModalFooter>
              <Button size="lg" color="primary" onClick={() => window.open("https://mail.google.com", "_blank")}>
                Confirm Email
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
