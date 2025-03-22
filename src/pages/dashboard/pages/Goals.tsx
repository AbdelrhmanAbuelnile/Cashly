import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PlusCircle,
	Goal,
	Target,
	Plane,
	Wallet,
	ShoppingBag,
	Home,
	Loader2,
} from "lucide-react";
import { goalTypes } from "../../../types/goalTypes";
import { cropText, formatDate } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GoalsApi from "@/api/Goals";

function Goals() {
	const [expandedDescriptions, setExpandedDescriptions] = useState<
		Record<string, boolean>
	>({});

	// Fetch goals with React Query
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["goals"],
		queryFn: () => GoalsApi.getMyGoals({ limit: 20 }),
		select: (response) => response.data,
	});

	// Toggle description expansion
	const toggleDescription = (e: React.MouseEvent, goalId: string) => {
		e.preventDefault(); // Prevent navigation when clicking the button
		setExpandedDescriptions((prev) => ({
			...prev,
			[goalId]: !prev[goalId],
		}));
	};

	// Function to render icon based on goalIcon string using switch case
	const renderIcon = (iconName: string) => {
		switch (iconName.toLowerCase()) {
			case "target":
				return <Target className="h-6 w-6" />;
			case "plane":
				return <Plane className="h-6 w-6" />;
			case "wallet":
				return <Wallet className="h-6 w-6" />;
			case "shopping":
			case "shoppingbag":
				return <ShoppingBag className="h-6 w-6" />;
			case "home":
				return <Home className="h-6 w-6" />;
			default:
				return <Goal className="h-6 w-6" />;
		}
	};

	const handleStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "paused":
				return "bg-yellow-600";
			case "completed":
				return "bg-blue-500";
			case "failed":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	// New Goal button component - reusable
	const NewGoalButton = ({ className = "", large = false }) => (
		<Link to="/dashboard/new-goal" className={className}>
			<button
				className={`group bg-[#543A14] text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
					large ? "p-4" : ""
				}`}
			>
				<div className="flex items-center">
					<PlusCircle className={`${large ? "h-8 w-8" : "h-6 w-6"}`} />
					<span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
						New Goal
					</span>
				</div>
			</button>
		</Link>
	);

	// Handle loading state
	if (isLoading) {
		return (
			<div className="container h-screen flex justify-center items-center text-center">
				<Loader2 size={64} className="animate-spin" />
			</div>
		);
	}

	// Handle error state
	if (isError) {
		return (
			<div className="container mx-auto py-4 text-center text-red-500">
				Error loading goals:{" "}
				{error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	// Get goals from the query response
	const goals: goalTypes[] = Array.isArray(data) ? data : data?.goals || [];

	// Empty state with prominent new goal button
	if (goals.length === 0) {
		return (
			<div className="container mx-auto py-4">
				<div className="flex flex-col items-center justify-center py-16">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							No goals found
						</h2>
						<p className="text-gray-600">
							Start your journey by creating your first goal
						</p>
					</div>
					<NewGoalButton large={true} />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{goals.map((goal) => (
					<Link
						to={`/dashboard/goals/${goal._id}`}
						key={goal._id}
						className="block transition-transform hover:scale-105"
					>
						<Card className="h-full bg-[#F0BB78] flex flex-col justify-between">
							<CardHeader className="flex flex-row items-center gap-2">
								<div className="bg-[#543A14]/10 p-2 rounded-full">
									{renderIcon(goal.goalIcon || "")}
								</div>
								<div>
									<CardTitle className="text-[#543A14] font-semibold">
										{goal.goalName}
									</CardTitle>
									<CardDescription className="text-sm text-black">
										Target: ${goal.goalAmount.toLocaleString()}
									</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="text-[#000000]">
								{goal.goalDescription && (
									<div>
										<span className="text-base">
											{expandedDescriptions[goal._id]
												? goal.goalDescription
												: cropText(goal.goalDescription, 100)}
										</span>
										{goal.goalDescription.length > 100 && (
											<button
												onClick={(e) => toggleDescription(e, goal._id)}
												className="text-sm text-[#543A14] font-medium ml-1 underline"
											>
												{expandedDescriptions[goal._id]
													? "Show less"
													: "Read more"}
											</button>
										)}
									</div>
								)}
							</CardContent>

							<CardFooter className="flex justify-between items-end text-sm text-white">
								<div>
									<p>Start: {formatDate(goal.goalStartDate)}</p>
									<p>End: {formatDate(goal.goalEndDate)}</p>
								</div>
								<div className="flex items-center text-white">
									<span
										className={`inline-block w-2 h-2 rounded-full mr-1 ${handleStatusColor(
											goal.goalStatus
										)}`}
									></span>
									{goal.goalStatus}
								</div>
							</CardFooter>
						</Card>
					</Link>
				))}
			</div>

			{/* Add New Goal Button (fixed to bottom right) */}
			<div className="fixed bottom-6 right-6 z-10">
				<NewGoalButton />
			</div>
		</div>
	);
}

export default Goals;
