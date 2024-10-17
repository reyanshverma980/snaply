import { Outlet } from "react-router-dom";
import "./globals.css";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthContext";

const App = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<main className="flex h-screen">
					<Outlet />
					<Toaster />
				</main>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default App;
