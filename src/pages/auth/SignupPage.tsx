import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Mail,
	Lock,
	User,
	Phone,
	ArrowRight,
	Eye,
	EyeOff,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import AuthApi from "../../api/Auth";

const SignupPage = () => {
	const showSnackbar = useSnackbar();
	const nav = useNavigate();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type, checked } = e.target as HTMLInputElement;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			showSnackbar("Passwords do not match!", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			return;
		}
		if (!termsAccepted) {
			showSnackbar("Please accept the Terms and Conditions", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			return;
		}
		// Validation logic
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?[0-9]\d{1,14}$/;

		if (!emailRegex.test(formData.email)) {
			showSnackbar("Please enter a valid email address", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			return;
		}

		if (!phoneRegex.test(formData.phone)) {
			showSnackbar("Please enter a valid phone number", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			return;
		}

		if (formData.password.length < 8) {
			showSnackbar("Password must be at least 8 characters long", {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			return;
		}
		setLoading(true);

		AuthApi.register(formData)
			.then(() => {
				setLoading(false);
				showSnackbar("Signup successful", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				nav("/signin");
			})
			.catch((err) => {
				setLoading(false);
				showSnackbar(err.response.data.message, {
					type: "error",
					title: "Error",
					duration: 5000,
				});
			});
	};

	const handleGoogleSignup = () => {
		window.location.href = import.meta.env.VITE_BASEURL + "/auth/google";
		console.log("Google Signup initiated");
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
						Create Your Account
					</h1>
					<p className="text-[#543A14]/70">
						Start your financial journey with Cashly
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex space-x-4">
						<div className="relative w-1/2">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<User className="text-[#543A14]/50 w-5 h-5" />
							</div>
							<input
								type="text"
								name="firstName"
								placeholder="First Name"
								value={formData.firstName}
								onChange={handleChange}
								required
								className="w-full pl-10 pr-4 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
							/>
						</div>
						<div className="relative w-1/2">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<User className="text-[#543A14]/50 w-5 h-5" />
							</div>
							<input
								type="text"
								name="lastName"
								placeholder="Last Name"
								value={formData.lastName}
								onChange={handleChange}
								required
								className="w-full pl-10 pr-4 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
							/>
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail className="text-[#543A14]/50 w-5 h-5" />
						</div>
						<input
							type="email"
							name="email"
							placeholder="Email Address"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full pl-10 pr-4 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Phone className="text-[#543A14]/50 w-5 h-5" />
						</div>
						<input
							type="tel"
							name="phone"
							placeholder="Phone Number"
							value={formData.phone}
							onChange={handleChange}
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
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleChange}
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

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="text-[#543A14]/50 w-5 h-5" />
						</div>
						<input
							type={showConfirmPassword ? "text" : "password"}
							name="confirmPassword"
							placeholder="Confirm Password"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							className="w-full pl-10 pr-10 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#543A14]/50"
						>
							{showConfirmPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>

					<div className="relative">
						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 border border-[#F0BB78] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0BB78] text-[#543A14]"
						>
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="prefer-not-to-say">Prefer Not to Say</option>
						</select>
					</div>
				</form>
				<div className="flex items-center my-4">
					<div className="flex-grow h-px bg-[#543A14]/20"></div>
					<span className="px-4 text-[#543A14]/50">or</span>
					<div className="flex-grow h-px bg-[#543A14]/20"></div>
				</div>

				<button
					onClick={handleGoogleSignup}
					className="w-full flex items-center justify-center py-3 border border-[#F0BB78] rounded-lg hover:bg-[#FFF0DC] transition-colors"
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
					<span className="text-[#543A14]">Continue with Google</span>
				</button>

				<div className="mt-4 flex items-center">
					<input
						type="checkbox"
						id="terms"
						name="terms"
						checked={termsAccepted}
						onChange={(e) => setTermsAccepted(e.target.checked)}
						className="mr-2 text-[#F0BB78] focus:ring-[#F0BB78]"
					/>
					<label htmlFor="terms" className="text-sm text-[#543A14]/70">
						I agree to the Terms and Conditions
					</label>
				</div>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					type="submit"
					onClick={(e) =>
						handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
					}
					disabled={!termsAccepted}
					className="w-full mt-4 py-3 bg-[#F0BB78] text-[#543A14] rounded-lg 
                               hover:bg-[#E0AA68] transition-colors 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center"
				>
					Create Account
					{loading ? (
						<Loader2 className="ml-2 animate-spin" />
					) : (
						<ArrowRight className="ml-2" />
					)}
				</motion.button>

				<div className="mt-4 text-center text-sm text-[#543A14]/70">
					Already have an account?
					<Link to="/signin" className="ml-1 text-[#F0BB78] hover:underline">
						Log in
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default SignupPage;
