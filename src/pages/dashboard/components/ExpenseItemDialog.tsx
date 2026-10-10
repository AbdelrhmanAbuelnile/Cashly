import React, { useEffect, useState } from "react";
import { Tag, DollarSign, FileText, ListChecks } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
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
import {
	ExpenseItemStatus,
	ExpenseItemTypes,
} from "@/types/expenseCollectionTypes";

export interface ExpenseItemFormData {
	name: string;
	amount: number;
	note: string;
	status: ExpenseItemStatus;
}

interface ExpenseItemDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: ExpenseItemFormData) => Promise<void> | void;
	item?: ExpenseItemTypes | null;
}

const statusOptions: { value: ExpenseItemStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "asked", label: "Price Requested" },
	{ value: "agreed", label: "Agreed" },
	{ value: "paid", label: "Paid" },
];

const emptyForm: ExpenseItemFormData = {
	name: "",
	amount: 0,
	note: "",
	status: "pending",
};

const ExpenseItemDialog: React.FC<ExpenseItemDialogProps> = ({
	open,
	onOpenChange,
	onSubmit,
	item,
}) => {
	const isEditMode = Boolean(item);

	const [formData, setFormData] = useState<ExpenseItemFormData>(emptyForm);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open) {
			setErrors({});
			if (item) {
				setFormData({
					name: item.name,
					amount: item.amount,
					note: item.note || "",
					status: item.status,
				});
			} else {
				setFormData(emptyForm);
			}
		}
	}, [open, item]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "amount" ? parseFloat(value) || 0 : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleStatusChange = (value: string) => {
		setFormData((prev) => ({ ...prev, status: value as ExpenseItemStatus }));
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Expense name is required";
		} else if (formData.name.length > 100) {
			newErrors.name = "Name must be 100 characters or fewer";
		}

		if (!formData.amount || formData.amount <= 0) {
			newErrors.amount = "Amount must be greater than 0";
		}

		if (formData.note && formData.note.length > 500) {
			newErrors.note = "Note must be 500 characters or fewer";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setSubmitting(true);
		try {
			await onSubmit(formData);
			onOpenChange(false);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:max-w-lg w-10/12 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						{isEditMode ? "Edit Expense" : "Add Expense"}
					</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update this expense's details or status."
							: "Add a planned expense to this list. You can update its status as you go."}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name" className="flex items-center gap-2">
								<Tag className="h-4 w-4" /> Name
							</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="e.g., Venue deposit, Planner fee"
								className={errors.name ? "border-red-500" : ""}
								maxLength={100}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="amount" className="flex items-center gap-2">
								<DollarSign className="h-4 w-4" /> Amount
							</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								step="0.01"
								min="0"
								value={formData.amount || ""}
								onChange={handleChange}
								placeholder="0.00"
								className={errors.amount ? "border-red-500" : ""}
							/>
							{errors.amount && (
								<p className="text-red-500 text-sm">{errors.amount}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="status" className="flex items-center gap-2">
								<ListChecks className="h-4 w-4" /> Status
							</Label>
							<Select value={formData.status} onValueChange={handleStatusChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{formData.status === "paid" && (
								<p className="text-xs text-gray-500">
									Marking this as Paid will record a real expense transaction
									and deduct it from your balance.
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="note" className="flex items-center gap-2">
								<FileText className="h-4 w-4" /> Note
							</Label>
							<Textarea
								id="note"
								name="note"
								value={formData.note}
								onChange={handleChange}
								placeholder="Optional details, e.g. who you spoke to about pricing"
								rows={2}
								className={errors.note ? "border-red-500" : ""}
								maxLength={500}
							/>
							{errors.note && (
								<p className="text-red-500 text-sm">{errors.note}</p>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={submitting}>
							{submitting
								? "Saving..."
								: isEditMode
								? "Save Changes"
								: "Add Expense"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ExpenseItemDialog;
