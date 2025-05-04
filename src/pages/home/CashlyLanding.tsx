import { motion } from "framer-motion";
import { Wallet, Goal, BarChart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

const CashlyLanding = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	const currentYear = new Date().getFullYear();
	const handleGetStartedClick = () => {
		ReactGA.event({
			category: "get started",
			action: "user clicked the Get Started button and my sign in or sign up",
		});
		navigate("/signin");
	};

	return (
		<div className="min-h-screen bg-[#FFF0DC] text-[#543A14]">
			{/* Navigation */}
			<nav className="w-full px-6 py-4 flex justify-between items-center bg-[#F0BB78] shadow-md">
				<div className="flex items-center">
					<Wallet className="h-8 w-8 mr-2 text-[#543A14]" />
					<span className="text-xl font-bold text-[#543A14]">Cashly</span>
				</div>

				{/* Mobile Menu Toggle */}
				<div className="md:hidden">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="text-[#543A14]"
					>
						{isMenuOpen ? <X /> : <Menu />}
					</button>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex space-x-4 items-center">
					<a
						href="#"
						className="text-[#543A14] hover:text-[#131010] transition"
					>
						Home
					</a>
					<a
						href="#"
						className="text-[#543A14] hover:text-[#131010] transition"
					>
						Features
					</a>
					<button
						onClick={handleGetStartedClick}
						className="bg-[#543A14] text-[#FFF0DC] px-4 py-2 rounded-lg hover:bg-[#131010] transition"
					>
						Get Started
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					className="md:hidden bg-[#F0BB78] absolute w-full z-20 py-4"
				>
					<div className="flex flex-col items-center space-y-4">
						<a href="#" className="text-[#543A14]">
							Home
						</a>
						<a href="#" className="text-[#543A14]">
							Features
						</a>
						<button
							onClick={handleGetStartedClick}
							className="bg-[#543A14] text-[#FFF0DC] px-4 py-2 rounded-lg"
						>
							Get Started
						</button>
					</div>
				</motion.div>
			)}

			{/* Hero Section */}
			<motion.main
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center"
			>
				<motion.div variants={itemVariants} className="space-y-6">
					<h1 className="text-4xl md:text-5xl font-bold text-[#543A14] leading-tight">
						Take Control of Your Finances
					</h1>
					<p className="text-lg text-[#543A14] opacity-80">
						Track your expenses, set savings goals, and understand your spending
						habits with Cashly, your personal finance companion.
					</p>
					<div className="flex space-x-4">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleGetStartedClick}
							className="bg-[#543A14] text-[#FFF0DC] px-6 py-3 rounded-lg hover:bg-[#131010] transition"
						>
							Get Started
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="text-[#543A14] border border-[#543A14] px-6 py-3 rounded-lg hover:bg-[#F0BB78]/20 transition"
						>
							Learn More
						</motion.button>
					</div>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="hidden md:flex justify-center"
				>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{
							rotate: [0, 5, -5, 0],
							transition: {
								duration: 2,
								repeat: Infinity,
								repeatType: "mirror",
							},
						}}
						className="bg-[#F0BB78] p-8 rounded-xl shadow-xl"
					>
						<Wallet className="h-64 w-64 text-[#543A14]" />
					</motion.div>
				</motion.div>
			</motion.main>

			{/* Features Section */}
			<motion.section
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="bg-[#F0BB78]/20 py-16"
			>
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center text-[#543A14] mb-12">
						Features That Help You Save
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Wallet,
								title: "Expense Tracking",
								description:
									"Easily log and categorize your daily expenses with Cashly's intuitive interface.",
							},
							{
								icon: Goal,
								title: "Savings Goals",
								description:
									"Set and track your financial goals with Cashly's smart progress tracking.",
							},
							{
								icon: BarChart,
								title: "Smart Insights",
								description:
									"Get detailed insights into your spending patterns and financial health.",
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className="bg-[#FFF0DC] p-6 rounded-xl text-center hover:shadow-lg transition duration-300"
							>
								<div className="flex justify-center mb-4">
									<feature.icon className="h-12 w-12 text-[#543A14]" />
								</div>
								<h3 className="text-xl font-bold text-[#543A14] mb-3">
									{feature.title}
								</h3>
								<p className="text-[#543A14] opacity-80">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* Footer */}
			<footer className="bg-[#543A14] text-[#FFF0DC] py-8">
				<div className="container mx-auto px-6 text-center">
					<p>&copy; {currentYear} Cashly. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default CashlyLanding;
