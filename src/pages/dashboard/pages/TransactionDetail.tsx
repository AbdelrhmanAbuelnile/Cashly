import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChevronLeft,
	Edit,
	Calendar,
	Trash2,
	ArrowUpRight,
	ArrowDownLeft,
	Wallet,
	Loader2,
	ShoppingBag,
	DollarSign,
	Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TransactionsApi from "@/api/Transactions";
import { useAuth } from "@/hooks/useAuth";
// import { useSnackbar } from "@/hooks/useSnackbar";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
	_id: string;
	name: string;
	amount: number;
	type: string;
	description?: string;
	transactionIcon?: string;
	createdAt: string;
	updatedAt: string;
	goalId?: string;
	goal?: {
		_id: string;
		goalName: string;
	};
}

// Function to render icon based on transactionIcon string
const renderIcon = (iconName: string, type: string) => {
	// Default icons based on transaction type
	if (!iconName) {
		return type === "income" ? (
			<ArrowUpRight className="h-6 w-6 text-green-500" />
		) : (
			<ArrowDownLeft className="h-6 w-6 text-red-500" />
		);
	}

	switch (iconName.toLowerCase()) {
		case "wallet":
			return <Wallet className="h-6 w-6" />;
		case "shopping":
		case "shoppingbag":
			return <ShoppingBag className="h-6 w-6" />;
		case "money":
		case "dollar":
		case "dollarSign":
			return <DollarSign className="h-6 w-6" />;
		default:
			return type === "income" ? (
				<ArrowUpRight className="h-6 w-6 text-green-500" />
			) : (
				<ArrowDownLeft className="h-6 w-6 text-red-500" />
			);
	}
};

function TransactionDetail() {
	const { transactionId } = useParams();
	const { user } = useAuth();
	// const [editDialogOpen, setEditDialogOpen] = useState(false);
	// const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	// const showSnackbar = useSnackbar();

	// State for the transaction data
	const [transaction, setTransaction] = useState<Transaction | null>(null);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["transaction", transactionId],
		queryFn: () => TransactionsApi.getTransaction(transactionId || ""),
		select: (response) => response.data,
	});

	useEffect(() => {
		if (data) {
			console.log("🚀 ~ useEffect ~ data:", data.transaction);
			setTransaction(data.transaction);
		}
	}, [data]);

	// Handle edit transaction
	// const handleEditTransaction = (updatedTransaction: Partial<Transaction>) => {
	// 	console.log("Updating transaction:", updatedTransaction);

	// 	const payload = {
	// 		transaction: {
	// 			name: updatedTransaction.name || "",
	// 			amount: updatedTransaction.amount || 0,
	// 			type: updatedTransaction.type || "expense",
	// 			description: updatedTransaction.description || "",
	// 			transactionIcon: updatedTransaction.transactionIcon || "",
	// 		},
	// 		goalId: updatedTransaction.goalId || undefined,
	// 	};

	// 	TransactionsApi.updateTransaction(transactionId || "", payload)
	// 		.then((response) => {
	// 			console.log("🚀 ~ handleEditTransaction ~ response:", response);
	// 			showSnackbar("Transaction updated successfully", {
	// 				type: "success",
	// 				title: "Success",
	// 				duration: 5000,
	// 			});
	// 			refetch();
	// 		})
	// 		.catch((error) => {
	// 			console.log("🚀 ~ handleEditTransaction ~ error:", error);
	// 			showSnackbar("Failed to update transaction", {
	// 				type: "error",
	// 				title: "Error",
	// 				duration: 5000,
	// 			});
	// 		});
	// };

	// Handle transaction deletion
	// const handleDeleteTransaction = () => {
	// 	console.log("Deleting transaction:", transactionId);
	// 	TransactionsApi.deleteTransaction(transactionId || "")
	// 		.then(() => {
	// 			showSnackbar("Transaction deleted successfully", {
	// 				type: "success",
	// 				title: "Success",
	// 				duration: 5000,
	// 			});
	// 			window.history.back();
	// 		})
	// 		.catch((error) => {
	// 			console.log("🚀 ~ handleDeleteTransaction ~ error:", error);
	// 			showSnackbar("Failed to delete transaction", {
	// 				type: "error",
	// 				title: "Error",
	// 				duration: 5000,
	// 			});
	// 		});
	// };

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
				Error loading transaction:{" "}
				{error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	return (
		transaction && (
			<div className="container mx-auto p-4 max-w-4xl">
				{/* Header with back navigation */}
				<div className="mb-6">
					<button
						onClick={() => window.history.back()}
						className="flex items-center text-primary hover:underline mb-2"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Back to Transactions
					</button>
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold">{transaction.name}</h1>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							// onClick={() => setEditDialogOpen(true)}
						>
							<Edit className="h-4 w-4" /> Edit
						</Button>
					</div>
				</div>

				{/* Main transaction information card */}
				<Card className="mb-6">
					<CardHeader className="flex flex-row items-center gap-3">
						<div
							className={`p-3 rounded-full ${
								transaction.type === "income" ? "bg-green-100" : "bg-red-100"
							}`}
						>
							{renderIcon(transaction.transactionIcon || "", transaction.type)}
						</div>
						<div>
							<CardTitle className="text-2xl">{transaction.name}</CardTitle>
							<CardDescription>
								{transaction.type === "income" ? "Income" : "Expense"}
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Amount */}
						<div>
							<p className="text-sm text-gray-500 mb-1">Amount</p>
							<p
								className={`text-2xl font-bold ${
									transaction.type === "income"
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{transaction.type === "income" ? "+" : "-"}
								{formatCurrency(transaction.amount, user?.currency)}
							</p>
						</div>

						{/* Date */}
						<div className="flex items-start gap-2">
							<Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
							<div>
								<p className="font-semibold">Date</p>
								<p className="text-gray-600">
									{formatDate(transaction.createdAt)}
								</p>
							</div>
						</div>

						{/* Description if available */}
						{transaction.description && (
							<div className="flex items-start gap-2">
								<Info className="h-5 w-5 text-gray-500 mt-0.5" />
								<div>
									<p className="font-semibold">Description</p>
									<p className="text-gray-600">{transaction.description}</p>
								</div>
							</div>
						)}

						{/* Related Goal if available */}
						{transaction.goal && (
							<div className="flex items-start gap-2">
								<Wallet className="h-5 w-5 text-gray-500 mt-0.5" />
								<div>
									<p className="font-semibold">Related Goal</p>
									<p className="text-primary">
										<a
											href={`/dashboard/goals/${transaction.goal._id}`}
											className="hover:underline"
										>
											{transaction.goal.goalName}
										</a>
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Action buttons */}
				<div className="grid grid-cols-2 gap-4">
					<Button
						variant="outline"
						className="w-full"
						onClick={() => window.history.back()}
					>
						Go Back
					</Button>
					<Button
						variant="destructive"
						className="w-full flex items-center justify-center gap-2"
						// onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2 className="h-4 w-4" /> Delete Transaction
					</Button>
				</div>

				{/* Dialogs */}
				{/* <EditTransactionDialog
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSubmit={handleEditTransaction}
					// transaction={transaction}
				/>

				<DeleteTransactionDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					onConfirm={handleDeleteTransaction}
					// transactionName={transaction.name}
				/> */}
			</div>
		)
	);
}

export default TransactionDetail;
