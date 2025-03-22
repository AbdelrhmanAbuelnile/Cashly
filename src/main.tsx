import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./hooks/useAuth.tsx";
import { SnackbarProvider } from "./hooks/useSnackbar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Router>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SnackbarProvider>
						<App />
					</SnackbarProvider>
				</AuthProvider>
			</QueryClientProvider>
		</Router>
	</StrictMode>
);
