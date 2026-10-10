import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ChevronLeft,
	Edit,
	Trash2,
	Loader2,
	PlusCircle,
	Folder,
	Heart,
	Home,
	Car,
	Briefcase,
	Plane,
	PartyPopper,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ExpenseCollectionsApi from "@/api/ExpenseCollections";
import { useAuth } from "@/hooks/useAuth";
import { useSnackbar } from "@/hooks/useSnackbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
	ExpenseItemStatus,
	ExpenseItemTypes,
} from "@/types/expenseCollectionTypes";
import ExpenseItemDialog, {
	ExpenseItemFormData,
} from "../components/ExpenseItemDialog";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

const getErrorMessage = (err: unknown, fallback: string) =>
	(err as ApiError)?.response?.data?.message || fallback;
import DeleteExpenseItemDialog from "../components/DeleteExpenseItemDialog";
import EditExpenseCollectionDialog, {
	EditCollectionFormData,
} from "../components/EditExpenseCollectionDialog";
import DeleteExpenseCollectionDialog from "../components/DeleteExpenseCollectionDialog";

const renderIcon = (iconName: string) => {
	switch (iconName.toLowerCase()) {
		case "heart":
			return <Heart className="h-6 w-6" />;
		case "home":
			return <Home className="h-6 w-6" />;
		case "car":
			return <Car className="h-6 w-6" />;
		case "briefcase":
			return <Briefcase className="h-6 w-6" />;
		case "plane":
			return <Plane className="h-6 w-6" />;
		case "party":
			return <PartyPopper className="h-6 w-6" />;
		default:
			return <Folder className="h-6 w-6" />;
	}
};

const statusOptions: { value: ExpenseItemStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "asked", label: "Price Requested" },
	{ value: "agreed", label: "Agreed" },
	{ value: "paid", label: "Paid" },
];

const statusBadgeClass = (status: ExpenseItemStatus) => {
	switch (status) {
		case "paid":
			return "bg-green-100 text-green-800 border-green-300";
		case "agreed":
			return "bg-blue-100 text-blue-800 border-blue-300";
		case "asked":
			return "bg-yellow-100 text-yellow-800 border-yellow-300";
		default:
			return "bg-gray-100 text-gray-700 border-gray-300";
	}
};

function ExpenseCollectionDetail() {
	const { collectionId } = useParams();
	const { user } = useAuth();
	const showSnackbar = useSnackbar();
	const queryClient = useQueryClient();

	const [editCollectionOpen, setEditCollectionOpen] = useState(false);
	const [deleteCollectionOpen, setDeleteCollectionOpen] = useState(false);
	const [itemDialogOpen, setItemDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<ExpenseItemTypes | null>(null);
	const [deletingItem, setDeletingItem] = useState<ExpenseItemTypes | null>(null);
	const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["expense-collection", collectionId],
		queryFn: () => ExpenseCollectionsApi.getCollection(collectionId || ""),
		select: (response) => response.data,
		enabled: Boolean(collectionId),
	});

	const refreshAll = () => {
		refetch();
		// Transactions change whenever an item is marked paid/unpaid, so keep
		// the Transactions page and user balance in sync too.
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
	};

	const handleAddItem = async (formData: ExpenseItemFormData) => {
		try {
			await ExpenseCollectionsApi.createItem(collectionId || "", formData);
			showSnackbar("Expense added", {
				type: "success",
				title: "Success",
				duration: 4000,
			});
			refreshAll();
		} catch (err: unknown) {
			showSnackbar(getErrorMessage(err, "Failed to add expense"), {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			throw err;
		}
	};

	const handleEditItem = async (formData: ExpenseItemFormData) => {
		if (!editingItem) return;
		try {
			await ExpenseCollectionsApi.updateItem(
				collectionId || "",
				editingItem._id,
				formData
			);
			showSnackbar("Expense updated", {
				type: "success",
				title: "Success",
				duration: 4000,
			});
			refreshAll();
		} catch (err: unknown) {
			showSnackbar(getErrorMessage(err, "Failed to update expense"), {
				type: "error",
				title: "Error",
				duration: 5000,
			});
			throw err;
		}
	};

	const handleStatusChange = (item: ExpenseItemTypes, status: ExpenseItemStatus) => {
		if (status === item.status) return;
		setStatusUpdatingId(item._id);
		ExpenseCollectionsApi.updateItemStatus(collectionId || "", item._id, status)
			.then(() => {
				showSnackbar(
					status === "paid"
						? "Marked as paid and recorded as a transaction"
						: "Status updated",
					{ type: "success", title: "Success", duration: 4000 }
				);
				refreshAll();
			})
			.catch((err: unknown) => {
				showSnackbar(
					getErrorMessage(err, "Failed to update status"),
					{ type: "error", title: "Error", duration: 5000 }
				);
			})
			.finally(() => setStatusUpdatingId(null));
	};

	const handleDeleteItem = () => {
		if (!deletingItem) return;
		ExpenseCollectionsApi.deleteItem(collectionId || "", deletingItem._id)
			.then(() => {
				showSnackbar("Expense deleted", {
					type: "success",
					title: "Success",
					duration: 4000,
				});
				refreshAll();
			})
			.catch((err: unknown) => {
				showSnackbar(
					getErrorMessage(err, "Failed to delete expense"),
					{ type: "error", title: "Error", duration: 5000 }
				);
			});
	};

	const handleEditCollection = async (formData: EditCollectionFormData) => {
		try {
			await ExpenseCollectionsApi.updateCollection(collectionId || "", formData);
			showSnackbar("Expense list updated", {
				type: "success",
				title: "Success",
				duration: 4000,
			});
			refetch();
		} catch (err: unknown) {
			showSnackbar(
				getErrorMessage(err, "Failed to update expense list"),
				{ type: "error", title: "Error", duration: 5000 }
			);
			throw err;
		}
	};

	const navigate = useNavigate();

	const handleDeleteCollection = () => {
		ExpenseCollectionsApi.deleteCollection(collectionId || "")
			.then(() => {
				showSnackbar("Expense list deleted", {
					type: "success",
					title: "Success",
					duration: 4000,
				});
				navigate("/dashboard/expense-collections");
			})
			.catch((err: unknown) => {
				showSnackbar(
					getErrorMessage(err, "Failed to delete expense list"),
					{ type: "error", title: "Error", duration: 5000 }
				);
			});
	};

	if (isLoading) {
		return (
			<div className="container h-screen flex justify-center items-center text-center">
				<Loader2 size={64} className="animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-4 text-center text-red-500">
				Error loading expense list:{" "}
				{error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	const collection = data?.collection;
	const items: ExpenseItemTypes[] = data?.items || [];
	const totalAmount: number = data?.totalAmount || 0;
	const paidAmount: number = data?.paidAmount || 0;
	const remainingAmount: number = data?.remainingAmount || 0;
	const progressPercentage =
		totalAmount > 0 ? Math.min(Math.floor((paidAmount / totalAmount) * 100), 100) : 0;

	if (!collection) {
		return null;
	}

	return (
		<div className="container mx-auto p-4 max-w-4xl">
			{/* Header with back navigation */}
			<div className="mb-6">
				<Link
					to="/dashboard/expense-collections"
					className="flex items-center text-primary hover:underline mb-2 w-fit"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Back to Expense Lists
				</Link>
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">{collection.name}</h1>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => setEditCollectionOpen(true)}
						>
							<Edit className="h-4 w-4" /> Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => setDeleteCollectionOpen(true)}
						>
							<Trash2 className="h-4 w-4" /> Delete
						</Button>
					</div>
				</div>
			</div>

			{/* Summary card */}
			<Card className="mb-6">
				<CardHeader className="flex flex-row items-center gap-3">
					<div className="bg-primary/10 p-3 rounded-full">
						{renderIcon(collection.icon || "")}
					</div>
					<div>
						<CardTitle className="text-2xl">{collection.name}</CardTitle>
						{collection.description && (
							<p className="text-sm text-gray-500">{collection.description}</p>
						)}
					</div>
				</CardHeader>

				<CardContent>
					<div className="mb-2 flex justify-between items-end">
						<div>
							<p className="text-sm text-gray-500">Paid / Total</p>
							<p className="text-xl font-bold">
								{formatCurrency(paidAmount, user?.currency)} /{" "}
								{formatCurrency(totalAmount, user?.currency)}
							</p>
						</div>
						<p className="text-lg font-bold">{progressPercentage}%</p>
					</div>
					<Progress value={progressPercentage} className="h-2 mb-2" />
					<p className="text-sm text-gray-500">
						{formatCurrency(remainingAmount, user?.currency)} remaining
					</p>
				</CardContent>
			</Card>

			{/* Items list */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="text-xl">Expenses</CardTitle>
				</CardHeader>
				<CardContent>
					{items.length === 0 ? (
						<p className="text-gray-600">
							No expenses added yet. Click "Add Expense" below to start
							tracking.
						</p>
					) : (
						<div className="space-y-3">
							{items.map((item) => (
								<div
									key={item._id}
									className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b last:border-b-0"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2 flex-wrap">
											<p className="font-medium">{item.name}</p>
											<span
												className={`text-xs px-2 py-0.5 rounded-full border ${statusBadgeClass(
													item.status
												)}`}
											>
												{
													statusOptions.find((s) => s.value === item.status)
														?.label
												}
											</span>
										</div>
										{item.note && (
											<p className="text-sm text-gray-500 mt-0.5">
												{item.note}
											</p>
										)}
										<p className="text-xs text-gray-400 mt-0.5">
											Added {formatDate(item.createdAt)}
										</p>
									</div>

									<div className="flex items-center gap-2 flex-wrap">
										<p className="font-semibold w-24 text-right">
											{formatCurrency(item.amount, user?.currency)}
										</p>

										<Select
											value={item.status}
											onValueChange={(value) =>
												handleStatusChange(item, value as ExpenseItemStatus)
											}
											disabled={statusUpdatingId === item._id}
										>
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{statusOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Button
											variant="ghost"
											size="icon"
											onClick={() => {
												setEditingItem(item);
												setItemDialogOpen(true);
											}}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setDeletingItem(item)}
										>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full flex items-center justify-center gap-2"
						onClick={() => {
							setEditingItem(null);
							setItemDialogOpen(true);
						}}
					>
						<PlusCircle className="h-4 w-4" /> Add Expense
					</Button>
				</CardFooter>
			</Card>

			{/* Dialogs */}
			<ExpenseItemDialog
				open={itemDialogOpen}
				onOpenChange={setItemDialogOpen}
				onSubmit={editingItem ? handleEditItem : handleAddItem}
				item={editingItem}
			/>

			{deletingItem && (
				<DeleteExpenseItemDialog
					open={Boolean(deletingItem)}
					onOpenChange={(open) => !open && setDeletingItem(null)}
					onConfirm={handleDeleteItem}
					itemName={deletingItem.name}
					isPaid={deletingItem.status === "paid"}
				/>
			)}

			<EditExpenseCollectionDialog
				open={editCollectionOpen}
				onOpenChange={setEditCollectionOpen}
				onSubmit={handleEditCollection}
				collection={collection}
			/>

			<DeleteExpenseCollectionDialog
				open={deleteCollectionOpen}
				onOpenChange={setDeleteCollectionOpen}
				onConfirm={handleDeleteCollection}
				collectionName={collection.name}
			/>
		</div>
	);
}

export default ExpenseCollectionDetail;
