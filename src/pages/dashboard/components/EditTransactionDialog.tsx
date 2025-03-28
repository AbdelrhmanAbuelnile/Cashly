import React, { useState, useEffect } from "react";
import {
	Target,
	DollarSign,
	FileText,
	ShoppingCart,
	Coffee,
	Home,
	Car,
	CreditCard,
	Utensils,
	Gift,
	Receipt,
	ArrowUpRight,
	ArrowDownLeft,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TransactionTypes } from "@/types/transactionTypes";

interface EditTransactionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Partial<TransactionTypes>) => void;
	transaction: TransactionTypes;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
	open,
	onOpenChange,
	onSubmit,
	transaction,
}) => {
	const [formData, setFormData] = useState<Partial<TransactionTypes>>({
		name: "",
		amount: 0,
		description: "",
		transactionIcon: "",
		type: "",
	});

	// Initialize form data when goal changes or dialog opens
	useEffect(() => {
		if (transaction && open) {
			setFormData({
				name: transaction.name || "",
				amount: transaction.amount || 0,
				description: transaction.description || "",
				transactionIcon: transaction.transactionIcon || "",
				type: transaction.type || "",
			});
		}
	}, [transaction, open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "amount" ? parseFloat(value) || 0 : value,
		}));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		onOpenChange(false);
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
			icon: <ArrowDownLeft className="h-5 w-5 text-red-500" />,
		},
		{
			value: "income",
			label: "Income",
			icon: <ArrowUpRight className="h-5 w-5 text-green-500" />,
		},
	];
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:max-w-lg w-10/12 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Edit Transaction{" "}
						<span className="underline">{transaction.name}</span>
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="type">Transaction Type *</Label>
							<Select
								value={formData.type}
								onValueChange={(value: string) =>
									handleSelectChange("type", value)
								}
							>
								<SelectTrigger>
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
						</div>
						<div className="grid gap-2">
							<Label htmlFor="name" className="flex items-center gap-2">
								<Target className="h-4 w-4" /> Transaction Name
							</Label>
							<Input
								id="name"
								name="name"
								required
								value={formData.name}
								onChange={handleChange}
								placeholder="Goal Name"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="amount" className="flex items-center gap-2">
								<DollarSign className="h-4 w-4" /> Target Amount
							</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								step="1.0"
								min="0"
								required
								value={formData.amount || ""}
								onChange={handleChange}
								placeholder="0.00"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description" className="flex items-center gap-2">
								<FileText className="h-4 w-4" /> Description
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description || ""}
								onChange={handleChange}
								placeholder="Goal description"
								rows={2}
							/>
						</div>

						<div className="grid gap-2">
							<Label
								htmlFor="transactionIcon"
								className="flex items-center gap-2"
							>
								<Target className="h-4 w-4" /> Icon
							</Label>
							<Select
								value={formData.transactionIcon}
								onValueChange={(value: string) =>
									handleSelectChange("transactionIcon", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
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
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditTransactionDialog;
