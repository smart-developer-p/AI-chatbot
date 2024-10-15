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
  const [selectedKey, setSelectedKey] = useState("login");
  const [loading, setLoading] = useState(false);
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
            toast.success(res?.message || "Please check your email");
            onClose();
          })
          .catch((err) => {
            console.log("wowowowoow", err);
            toast.error(err?.message || "Something went wrong");
            setLoading(false);
          });
      } else {
        register(values)
          .then(() => {
            setLoading(false);
            toast.success("SignUp successfull");
            onClose();
          })
          .catch((err) => {
            toast.error(err?.message || "Something went wrong");
            setLoading(false);
          });
      }
    },
  });
  const { getFieldProps, handleSubmit, resetForm, errors, touched } = formik;

  const handleTabChange = (key: Key) => {
    setSelectedKey(key as string);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
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
        <ModalFooter className="flex-col gap-4">
          {selectedKey === "login" ? (
            <p
              className="mx-auto cursor-pointer"
              onClick={() => setSelectedKey("signup")}
            >
              Don't have an account?
              <span className="text-primary font-bold"> SigUp</span>
            </p>
          ) : (
            <p
              className="mx-auto cursor-pointer"
              onClick={() => setSelectedKey("login")}
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
