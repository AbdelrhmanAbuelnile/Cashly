import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ArrowUpRight,
	ArrowDownLeft,
	Receipt,
	Coffee,
	Home,
	ShoppingCart,
	Car,
	Utensils,
	CreditCard,
	Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TransactionsApi from "@/api/Transactions";
import { useSnackbar } from "@/hooks/useSnackbar";
import GoalsApi from "@/api/Goals";
import { useAuth } from "@/hooks/useAuth";

interface TransactionData {
	transaction: {
		amount: number;
		name: string;
		type: string;
		description?: string;
		transactionIcon?: string;
	};
	goalId?: string;
}

interface Goal {
	_id: string;
	goalName: string;
}

function NewTransaction() {
	const navigate = useNavigate();
	const showSnackbar = useSnackbar();

	const { refreshToken } = useAuth();

	const [formData, setFormData] = useState<TransactionData>({
		transaction: {
			amount: 0,
			name: "",
			type: "expense",
			description: "",
			transactionIcon: "shopping-cart",
		},
		goalId: "",
	});

	const [goals, setGoals] = useState<Goal[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Fetch goals for the dropdown
		const fetchGoals = async () => {
			try {
				const response = await GoalsApi.getMyGoals({ limit: 20 });
				setGoals(response.data.goals);
				console.log("🚀 ~ fetchGoals ~ response.data:", response.data.goals);
			} catch (error) {
				console.error("Failed to fetch goals:", error);
			}
		};

		fetchGoals();
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		if (name === "amount") {
			if (value === "") {
				setFormData({
					...formData,
					transaction: { ...formData.transaction, [name]: 0 },
				});
				return;
			}
			const newVal = parseFloat(value);
			if (isNaN(newVal)) {
				return;
			} else {
				setFormData({
					...formData,
					transaction: { ...formData.transaction, [name]: newVal },
				});
			}
		} else if (name === "goalId") {
			setFormData({ ...formData, [name]: value });
		} else {
			setFormData({
				...formData,
				transaction: { ...formData.transaction, [name]: value },
			});
		}

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const handleSelectChange = (name: string, value: string) => {
		if (name === "goalId") {
			setFormData({ ...formData, [name]: value === "none" ? "" : value });
		} else {
			setFormData({
				...formData,
				transaction: { ...formData.transaction, [name]: value },
			});
		}

		// Clear error when user makes a selection
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.transaction.name.trim()) {
			newErrors.name = "Transaction name is required";
		}

		if (formData.transaction.amount <= 0) {
			newErrors.amount = "Amount must be greater than zero";
		}

		if (!formData.transaction.type) {
			newErrors.type = "Transaction type is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (validateForm()) {
			console.log(formData);
			TransactionsApi.createTransaction(formData)
				.then(() => {
					navigate("/dashboard/transactions");
					showSnackbar("Transaction created successfully", {
						type: "success",
						title: "Success",
						duration: 5000,
					});
					refreshToken();
				})
				.catch((error) => {
					console.error(error);
					setLoading(false);
					showSnackbar(
						error.response?.data?.message || "Failed to create transaction",
						{
							type: "error",
							title: "Error",
							duration: 5000,
						}
					);
				});
		} else {
			setLoading(false);
		}
	};

	const iconOptions = [
		{
			value: "shopping-cart",
			label: "Shopping",
			icon: <ShoppingCart className="h-5 w-5" />,
		},
		{
			value: "coffee",
			label: "Food/Drinks",
			icon: <Coffee className="h-5 w-5" />,
		},
		{ value: "home", label: "Housing", icon: <Home className="h-5 w-5" /> },
		{
			value: "car",
			label: "Transportation",
			icon: <Car className="h-5 w-5" />,
		},
		{
			value: "credit-card",
			label: "Bills",
			icon: <CreditCard className="h-5 w-5" />,
		},
		{
			value: "utensils",
			label: "Dining",
			icon: <Utensils className="h-5 w-5" />,
		},
		{ value: "gift", label: "Gift", icon: <Gift className="h-5 w-5" /> },
		{
			value: "receipt",
			label: "General",
			icon: <Receipt className="h-5 w-5" />,
		},
	];

	const transactionTypes = [
		{
			value: "expense",
			label: "Expense",
			icon: <ArrowUpRight className="h-5 w-5 text-red-500" />,
		},
		{
			value: "income",
			label: "Income",
			icon: <ArrowDownLeft className="h-5 w-5 text-green-500" />,
		},
	];

	return (
		<div className="container mx-auto py-8 px-4">
			<Button
				variant="ghost"
				className="mb-6 flex items-center gap-2"
				onClick={() => navigate("/dashboard/transactions")}
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Transactions
			</Button>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Transaction</CardTitle>
					<CardDescription>
						Record a new transaction to keep track of your finances
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="type">Transaction Type *</Label>
							<Select
								value={formData.transaction.type}
								onValueChange={(value: string) =>
									handleSelectChange("type", value)
								}
							>
								<SelectTrigger className={errors.type ? "border-red-500" : ""}>
									<SelectValue placeholder="Select transaction type" />
								</SelectTrigger>
								<SelectContent>
									{transactionTypes.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												{option.icon}
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.type && (
								<p className="text-red-500 text-sm">{errors.type}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Transaction Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.transaction.name}
								onChange={handleInputChange}
								placeholder="e.g., Grocery Shopping, Salary Deposit"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount *</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2">
									$
								</span>
								<Input
									id="amount"
									name="amount"
									type="number"
									min="0.01"
									step="0.01"
									value={formData.transaction.amount}
									onChange={handleInputChange}
									className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
									placeholder="0.00"
								/>
							</div>
							{errors.amount && (
								<p className="text-red-500 text-sm">{errors.amount}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="transactionIcon">Category Icon</Label>
							<Select
								value={formData.transaction.transactionIcon}
								onValueChange={(value: string) =>
									handleSelectChange("transactionIcon", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select an icon" />
								</SelectTrigger>
								<SelectContent>
									{iconOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												{option.icon}
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.transaction.description || ""}
								onChange={handleInputChange}
								placeholder="Add additional details about this transaction"
								rows={3}
							/>
						</div>

						{goals && goals.length > 0 && (
							<div className="space-y-2">
								<Label htmlFor="goalId">Associate with Goal (optional)</Label>
								<Select
									value={formData.goalId || ""}
									onValueChange={(value: string) =>
										handleSelectChange("goalId", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a goal (optional)" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										{goals.map((goal) => (
											<SelectItem key={goal._id} value={goal._id}>
												{goal.goalName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</CardContent>

					<CardFooter className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/dashboard/transactions")}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="bg-[#543A14] hover:bg-[#43300f]"
						>
							{loading ? (
								<>
									<span className="mr-2">Creating...</span>
									<span className="animate-spin">⟳</span>
								</>
							) : (
								"Create Transaction"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default NewTransaction;
