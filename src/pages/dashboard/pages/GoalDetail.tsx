import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	ChevronLeft,
	Edit,
	Calendar,
	Trash2,
	Goal,
	Loader2,
} from "lucide-react";
import { goalTypes } from "@/types/goalTypes";
import {
	formatCurrency,
	formatDate,
	validateTransactionType,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import GoalsApi from "@/api/Goals";
import { useAuth } from "@/hooks/useAuth";
import ContributionDialog, {
	ContributionFormData,
} from "../components/ContributionDialog";
import DeleteGoalDialog from "../components/DeleteGoalDialog";
import TransactionsApi from "@/api/Transactions";
import { useSnackbar } from "@/hooks/useSnackbar";
import EditGoalDialog from "../components/EditGoalDialog";

// Function to render icon based on goalIcon string using switch case
const renderIcon = (iconName: string) => {
	switch (iconName.toLowerCase()) {
		case "goal":
			return <Goal className="h-6 w-6" />;
		// Add other cases as needed
		default:
			return <Goal className="h-6 w-6" />;
	}
};

function GoalDetail() {
	const { goalId } = useParams();
	const { user } = useAuth();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const showSnackbar = useSnackbar();

	// State for the goal data
	const [goal, setGoal] = useState<goalTypes | null>();
	const [showAllTransactions, setShowAllTransactions] = useState(false);

	// State for dialogs
	const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["goal", goalId],
		queryFn: () => GoalsApi.getGoal(goalId || ""),
		select: (response) => response.data,
	});

	useEffect(() => {
		if (data) {
			console.log("🚀 ~ useEffect ~ data:", data.goal);
			setGoal(data.goal);
		}
	}, [data]);

	const progressPercentage =
		(goal?.goalAmount &&
			Math.min(
				Math.floor((goal?.goalBalance / goal?.goalAmount) * 100),
				100
			)) ||
		0;

	// Calculate days left
	const today = new Date();
	const endDate = new Date(goal?.goalEndDate || "");
	const daysLeft = Math.max(
		Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)),
		0
	);

	// Handle contribution submission
	const handleContributionSubmit = (data: ContributionFormData) => {
		const payload = {
			transaction: {
				...data,
			},
			goalId: goalId,
		};

		TransactionsApi.createTransaction(payload)
			.then((response) => {
				console.log("🚀 ~ handleContributionSubmit ~ response:", response);
				showSnackbar("Contribution added successfully", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				refetch();
			})
			.catch((error) => {
				console.log("🚀 ~ handleContributionSubmit ~ error:", error);
				showSnackbar("Failed to add contribution", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
			});

		console.log("🚀 ~ handleContributionSubmit ~ payload:", payload);
	};

	// Handle goal deletion
	const handleDeleteGoal = () => {
		console.log("Deleting goal:", goalId);
		// Here you would call your API to delete the goal
		GoalsApi.deleteGoal(goalId || "")
			.then(() => {
				showSnackbar("Goal deleted successfully", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				window.history.back();
			})
			.catch((error) => {
				console.log("🚀 ~ handleDeleteGoal ~ error:", error);
				showSnackbar("Failed to delete goal", {
					type: "error",
					title: "Error",
					duration: 5000,
				});
			});
	};

	const handleEditGoal = (updatedGoal: Partial<goalTypes>) => {
		console.log("Updating goal:", updatedGoal);

		const payload = {
			name: updatedGoal.goalName || "",
			icon: updatedGoal.goalIcon || "",
			amount: updatedGoal.goalAmount || 0,
			description: updatedGoal.goalDescription || "",
			startDate: updatedGoal.goalStartDate || "",
			endDate: updatedGoal.goalEndDate || "",
			status: updatedGoal.goalStatus || "active",
			goalBalance: updatedGoal.goalBalance || 0,
		};

		GoalsApi.updateGoal(goalId || "", payload)
			.then((response) => {
				console.log("🚀 ~ handleEditGoal ~ response:", response);
				showSnackbar("Goal updated successfully", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				refetch();
			})
			.catch((error) => {
				console.log("🚀 ~ handleEditGoal ~ error:", error);
				showSnackbar("Failed to update goal", {
					type: "error",
					title: "Error",
					duration: 5000,
				});
			});

		// Here you would call your API to update the goal
		// GoalsApi.updateGoal(goalId, updatedGoal)
		//   .then((response) => {
		//     // Update local state
		//     setGoal(prev => prev ? { ...prev, ...updatedGoal } : prev);
		//   });
	};

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

	return (
		goal && (
			<div className="container mx-auto p-4 max-w-4xl">
				{/* Header with back navigation */}
				<div className="mb-6">
					<button
						onClick={() => window.history.back()}
						className="flex items-center text-primary hover:underline mb-2"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Back to Goals
					</button>
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold">{goal.goalName}</h1>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => setEditDialogOpen(true)}
						>
							<Edit className="h-4 w-4" /> Edit
						</Button>
					</div>
				</div>

				{/* Main goal information card */}
				<Card className="mb-6">
					<CardHeader className="flex flex-row items-center gap-3">
						<div className="bg-primary/10 p-3 rounded-full">
							{renderIcon(goal.goalIcon || "")}
						</div>
						<div>
							<CardTitle className="text-2xl">{goal.goalName}</CardTitle>
							<CardDescription>{goal.goalDescription}</CardDescription>
						</div>
					</CardHeader>

					<CardContent>
						{/* Progress section */}
						<div className="mb-6">
							<div className="flex justify-between items-end mb-2">
								<div>
									<p className="text-sm text-gray-500">Progress</p>
									<p className="text-xl font-bold">
										{formatCurrency(goal.goalBalance, user?.currency)} /{" "}
										{formatCurrency(goal.goalAmount, user?.currency)}
									</p>
								</div>
								<p className="text-lg font-bold">{progressPercentage}%</p>
							</div>
							<Progress value={progressPercentage} className="h-2" />
						</div>

						{/* Timeline and details */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start gap-2">
								<Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
								<div>
									<p className="font-semibold">Timeline</p>
									<p className="text-sm text-gray-500">
										From {formatDate(goal.goalStartDate)}
									</p>
									<p className="text-sm text-gray-500">
										To {formatDate(goal.goalEndDate)}
									</p>
									<p className="text-sm font-medium mt-1 text-primary">
										{daysLeft || 0} days left
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2">
								{user?.currencySymbol}
								<div>
									<p className="font-semibold">Daily Saving Target</p>
									<p className="text-sm text-gray-500">To reach your goal:</p>
									<p className="text-lg font-medium">
										{goal.goalBalance &&
											formatCurrency(
												(goal.goalAmount - goal.goalBalance) /
													Math.max(daysLeft, 1),
												user?.currency
											)}{" "}
										/ day
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Transactions/Updates Card */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="text-xl">Recent Contributions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{(goal.transactions?.length ?? 0) === 0 && (
								<p>
									No contributions made yet. Click the button below to add a
									contribution.
								</p>
							)}
							{(showAllTransactions
								? goal.transactions
								: goal.transactions?.slice(0, 3)
							)?.map((transaction) => (
								<div
									key={transaction._id}
									className="flex justify-between items-center pb-2 border-b"
								>
									<div>
										<p className="font-medium">{transaction.name}</p>
										<p className="text-sm text-gray-500">
											{formatDate(transaction.createdAt)}
										</p>
									</div>
									<p
										className={`font-semibold ${
											validateTransactionType(transaction.type) === "income"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{validateTransactionType(transaction.type) === "income"
											? "+"
											: "-"}{" "}
										{formatCurrency(transaction.amount)}
									</p>
								</div>
							))}
						</div>
					</CardContent>
					{(goal.transactions?.length ?? 0) !== 0 ||
						((goal.transactions?.length ?? 0) > 3 && (
							<CardFooter>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => setShowAllTransactions(!showAllTransactions)}
								>
									{showAllTransactions ? "Show Less" : "View All Transactions"}
								</Button>
							</CardFooter>
						))}
				</Card>

				{/* Action buttons */}
				<div className="grid grid-cols-2 gap-4">
					<Button
						className="w-full"
						onClick={() => setContributionDialogOpen(true)}
					>
						Add Contribution
					</Button>
					<Button
						variant="destructive"
						className="w-full flex items-center justify-center gap-2"
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2 className="h-4 w-4" /> Delete Goal
					</Button>
				</div>

				{/* Dialogs */}
				<ContributionDialog
					open={contributionDialogOpen}
					onOpenChange={setContributionDialogOpen}
					onSubmit={handleContributionSubmit}
					goalId={goalId || ""}
				/>

				<DeleteGoalDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					onConfirm={handleDeleteGoal}
					goalName={goal.goalName}
				/>
				<EditGoalDialog
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSubmit={handleEditGoal}
					goal={goal}
				/>
			</div>
		)
	);
}

export default GoalDetail;
