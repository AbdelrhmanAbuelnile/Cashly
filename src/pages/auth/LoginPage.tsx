import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	LogIn,
	ArrowRight,
	Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";

const LoginPage = () => {
	const showSnackbar = useSnackbar();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Pass rememberMe to the login function
			await login({ email, password, rememberMe });

			showSnackbar("Login successful", {
				type: "success",
				title: "Success",
				duration: 5000,
			});
		} catch (error: any) {
			showSnackbar(error?.response?.data?.message || "Login failed", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		if (import.meta.env.VITE_MODE === "dev") {
			window.location.href = import.meta.env.VITE_BASEURL_DEV + "/auth/google";
		} else {
			window.location.href = import.meta.env.VITE_BASEURL + "/auth/google";
		}
	};

	return (
		<div className="min-h-screen bg-[#FFF0DC] flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-[#543A14] mb-2">
						Welcome Back
					</h1>
					<p className="text-[#543A14]/70">Log in to continue to Cashly</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail className="text-[#543A14]/50 w-5 h-5" />
						</div>
						<input
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full pl-10 pr-4 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="text-[#543A14]/50 w-5 h-5" />
						</div>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full pl-10 pr-10 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#543A14]/50"
						>
							{showPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
					<div className="flex items-center">
						<input
							type="checkbox"
							id="rememberMe"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className="w-4 h-4 text-[#543A14] border-[#F0BB78] rounded focus:ring-[#F0BB78]"
						/>
						<label
							htmlFor="rememberMe"
							className="ml-2 text-sm text-[#543A14]/70"
						>
							Remember me
						</label>
					</div>

					<div className="flex justify-between items-center">
						<a href="#" className="text-[#543A14]/70 hover:underline">
							Forgot Password?
						</a>
					</div>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="submit"
						className="w-full bg-[#543A14] text-[#FFF0DC] py-3 rounded-lg flex items-center justify-center hover:bg-[#131010] transition"
						disabled={loading}
					>
						<span>Login</span>
						{loading ? (
							<Loader2 className="ml-2 w-5 h-5 animate-spin" />
						) : (
							<LogIn className="ml-2 w-5 h-5" />
						)}
					</motion.button>
				</form>

				<div className="my-6 flex items-center">
					<div className="flex-grow border-t border-[#F0BB78]"></div>
					<span className="mx-4 text-[#543A14]/70">or</span>
					<div className="flex-grow border-t border-[#F0BB78]"></div>
				</div>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleGoogleLogin}
					className="w-full border border-[#F0BB78] text-[#543A14] py-3 rounded-lg flex items-center justify-center hover:bg-[#F0BB78]/20 transition"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="mr-2"
					>
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C4 20.54 7.73 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.07z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.73 1 4 3.46 2.18 7.07l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z"
						/>
					</svg>
					<span>Continue with Google</span>
				</motion.button>

				<div className="text-center mt-6 text-[#543A14]/70">
					Don't have an account?
					<Link
						to={"/signup"}
						className="ml-1 text-[#543A14] font-bold hover:underline"
					>
						Sign Up <ArrowRight className="inline w-4 h-4" />
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
