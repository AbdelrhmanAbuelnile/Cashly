import React, { useState } from "react";
import { DollarSign, FileText, User, Tag } from "lucide-react";
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

interface ContributionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: ContributionFormData) => void;
	goalId: string;
}

export interface ContributionFormData {
	amount: number;
	description: string;
	name: string;
	transactionIcon: string;
	type: string;
}

const ContributionDialog: React.FC<ContributionDialogProps> = ({
	open,
	onOpenChange,
	onSubmit,
}) => {
	const [formData, setFormData] = useState<ContributionFormData>({
		amount: 0,
		description: "",
		name: "",
		transactionIcon: "savings",
		type: "income",
	});

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
		// Reset form
		setFormData({
			amount: 0,
			description: "",
			name: "",
			transactionIcon: "savings",
			type: "income",
		});
	};

	// the type mean that the user is gaining money
	const incomeTypes = [
		"income",
		"loan",
		"borrow",
		"repay",
		"investment",
		"refund",
		"salary",
		"bonus",
		"interest",
		"dividend",
	];
	// the type mean that the user is losing money
	const expenseTypes = [
		"expense",
		"transfer",
		"withdraw",
		"fee",
		"tax",
		"rent",
		"utility",
		"grocery",
		"shopping",
		"entertainment",
		"dining",
		"transport",
		"health",
		"insurance",
		"education",
		"gift",
		"donation",
	];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:max-w-lg w-10/12 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						New Contribution
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
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
								required
								value={formData.amount || ""}
								onChange={handleChange}
								placeholder="0.00"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="name" className="flex items-center gap-2">
								<User className="h-4 w-4" /> Name
							</Label>
							<Input
								id="name"
								name="name"
								required
								value={formData.name}
								onChange={handleChange}
								placeholder="Contribution Name"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description" className="flex items-center gap-2">
								<FileText className="h-4 w-4" /> Description
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Description of this contribution"
								rows={2}
							/>
						</div>

						<div className="grid gap-2 mb-4">
							<Label htmlFor="type" className="flex items-center gap-2">
								<Tag className="h-4 w-4" /> Type
							</Label>
							<Select
								value={formData.type}
								onValueChange={(value) => handleSelectChange("type", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent className="h-[20rem] overflow-y-scroll">
									{incomeTypes.map((type) => (
										<SelectItem
											key={type}
											value={type}
											className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
										>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
									{expenseTypes.map((type) => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label
								htmlFor="transactionIcon"
								className="flex items-center gap-2"
							>
								<Tag className="h-4 w-4" /> Icon
							</Label>
							<Select
								value={formData.transactionIcon}
								onValueChange={(value) =>
									handleSelectChange("transactionIcon", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select icon" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="savings">Savings</SelectItem>
									<SelectItem value="bank">Bank</SelectItem>
									<SelectItem value="wallet">Wallet</SelectItem>
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
						<Button type="submit">Add Contribution</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ContributionDialog;
