import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./hooks/useAuth.tsx";
import { SnackbarProvider } from "./hooks/useSnackbar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { PostHogProvider } from "posthog-js/react";

// const options = {
// 	api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST || "",
// };
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* <PostHogProvider
			apiKey={import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY || ""}
			options={options}
		> */}
		<Router>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SnackbarProvider>
						<App />
					</SnackbarProvider>
				</AuthProvider>
			</QueryClientProvider>
		</Router>
		{/* </PostHogProvider> */}
	</StrictMode>
);
