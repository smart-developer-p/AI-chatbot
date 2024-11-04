import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import ChatPage from "./pages/chat";
import ActivateAccountPage from "@/pages/activate-account";
import ProfilePage from "./pages/profile";
import Setting from "./pages/setting";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ActivateAccountPage />} path="/verify-email" />
      <Route element={<ChatPage />} path="/c/:id" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<ProfilePage />} path="/profile" />
      <Route element={<Setting />} path="/setting" />
    </Routes>
  );
}

export default App;
