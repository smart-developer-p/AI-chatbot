import { NextUIProvider } from "@nextui-org/system";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ArchiveProvider } from "./contexts/ArchiveContext";

const queryClient = new QueryClient();
export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <AuthProvider>
        <StoreProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <ArchiveProvider>

            {children}
            </ArchiveProvider>
          </QueryClientProvider>
        </StoreProvider>
      </AuthProvider>
      <Toaster />
    </NextUIProvider>
  );
}
