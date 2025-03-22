import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PlusCircle,
	Wallet,
	DollarSign,
	ShoppingBag,
	ArrowUpRight,
	ArrowDownLeft,
	Loader2,
	Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TransactionsApi from "@/api/Transactions";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
	_id: string;
	name: string;
	amount: number;
	type: string;
	description?: string;
	transactionIcon?: string;
	createdAt: string;
	updatedAt: string;
}

function Transactions() {
	const { user } = useAuth();

	const [searchParams, setSearchParams] = useState({
		limit: 20,
		page: 1,
		sort: "createdAt",
		order: "desc",
		search: "",
	});

	const [searchInput, setSearchInput] = useState("");

	// Fetch transactions with React Query
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["transactions", searchParams],
		queryFn: () => TransactionsApi.getMyTransactions(searchParams),
		select: (response) => response.data,
	});

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

	const handleSortChange = (value: string) => {
		const [sort, order] = value.split("-");
		setSearchParams((prev) => ({
			...prev,
			sort,
			order,
		}));
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setSearchParams((prev) => ({
			...prev,
			search: searchInput,
			page: 1, // Reset to first page on new search
		}));
	};

	// New Transaction button component - reusable
	const NewTransactionButton = ({ className = "", large = false }) => (
		<Link to="/dashboard/new-transaction" className={className}>
			<button
				className={`group bg-[#543A14] text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
					large ? "p-4" : ""
				}`}
			>
				<div className="flex items-center">
					<PlusCircle className={`${large ? "h-8 w-8" : "h-6 w-6"}`} />
					<span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
						New Transaction
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
				Error loading transactions:{" "}
				{error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	// Get transactions from the query response
	const transactions: Transaction[] = data?.transactions || [];

	// Empty state with prominent new transaction button
	if (transactions.length === 0) {
		return (
			<div className="container mx-auto py-4">
				<div className="flex flex-col items-center justify-center py-16">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							No transactions found
						</h2>
						<p className="text-gray-600">
							Start by creating your first transaction
						</p>
					</div>
					<NewTransactionButton large={true} />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<div className="mb-6">
				<p className="text-gray-600">Manage your income and expenses</p>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm text-gray-500">Income</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-green-600">
							{user?.currencySymbol}
							{data?.totalIncome.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm text-gray-500">Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-red-600">
							{user?.currencySymbol}
							{data?.totalExpense.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm text-gray-500">Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<p
							className={`text-2xl font-bold ${
								user?.balance ?? 0 >= 0 ? "text-green-600" : "text-red-600"
							}`}
						>
							{user?.currencySymbol}
							{user?.balance &&
								user?.balance.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<form onSubmit={handleSearch} className="flex-1 flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
						<Input
							placeholder="Search transactions..."
							className="pl-10"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					<Button type="submit" variant="outline">
						Search
					</Button>
				</form>

				<div className="w-full md:w-64">
					<Select
						defaultValue="createdAt-desc"
						onValueChange={handleSortChange}
					>
						<SelectTrigger>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="createdAt-desc">Newest First</SelectItem>
							<SelectItem value="createdAt-asc">Oldest First</SelectItem>
							<SelectItem value="amount-desc">Highest Amount</SelectItem>
							<SelectItem value="amount-asc">Lowest Amount</SelectItem>
							<SelectItem value="name-asc">Name (A-Z)</SelectItem>
							<SelectItem value="name-desc">Name (Z-A)</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Transactions List */}
			<div className="space-y-4">
				{transactions.map((transaction) => (
					<Link
						to={`/dashboard/transactions/${transaction._id}`}
						key={transaction._id}
						className="block transition-transform hover:scale-101"
					>
						<Card className="bg-white hover:bg-gray-50 transition-colors">
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div
										className={`p-3 rounded-full ${
											transaction.type === "income"
												? "bg-green-100"
												: "bg-red-100"
										}`}
									>
										{renderIcon(
											transaction.transactionIcon || "",
											transaction.type
										)}
									</div>

									<div className="flex-1">
										<h3 className="font-semibold">{transaction.name}</h3>
										<p className="text-sm text-gray-500">
											{formatDate(transaction.createdAt)}
										</p>
										{transaction.description && (
											<p className="text-sm text-gray-600 mt-1">
												{transaction.description}
											</p>
										)}
									</div>

									<div className="text-right">
										<p
											className={`font-bold ${
												transaction.type === "income"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{transaction.type === "income" ? "+" : "-"}{" "}
											{user?.currencySymbol}
											{transaction.amount.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Pagination controls could be added here */}

			{/* Add New Transaction Button (fixed to bottom right) */}
			<div className="fixed bottom-6 right-6 z-10">
				<NewTransactionButton />
			</div>
		</div>
	);
}

export default Transactions;
