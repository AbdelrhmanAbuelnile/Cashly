import React, { useState, useEffect } from "react";
import { Target, DollarSign, FileText, Calendar, BarChart } from "lucide-react";
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
import { goalTypes } from "@/types/goalTypes";

interface EditGoalDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: Partial<goalTypes>) => void;
	goal: goalTypes;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({
	open,
	onOpenChange,
	onSubmit,
	goal,
}) => {
	const [formData, setFormData] = useState<Partial<goalTypes>>({
		goalName: "",
		goalAmount: 0,
		goalDescription: "",
		goalStartDate: "",
		goalEndDate: "",
		goalStatus: "",
		goalBalance: 0,
	});

	// Initialize form data when goal changes or dialog opens
	useEffect(() => {
		if (goal && open) {
			setFormData({
				goalName: goal.goalName || "",
				goalAmount: goal.goalAmount || 0,
				goalDescription: goal.goalDescription || "",
				goalStartDate: goal.goalStartDate
					? new Date(goal.goalStartDate).toISOString().split("T")[0]
					: "",
				goalEndDate: goal.goalEndDate
					? new Date(goal.goalEndDate).toISOString().split("T")[0]
					: "",
				goalStatus: goal.goalStatus || "active",
				goalBalance: goal.goalBalance || 0,
			});
		}
	}, [goal, open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "goalAmount" || name === "goalBalance"
					? parseFloat(value) || 0
					: value,
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:max-w-lg w-10/12 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">Edit Goal</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="goalName" className="flex items-center gap-2">
								<Target className="h-4 w-4" /> Goal Name
							</Label>
							<Input
								id="goalName"
								name="goalName"
								required
								value={formData.goalName}
								onChange={handleChange}
								placeholder="Goal Name"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="goalAmount" className="flex items-center gap-2">
								<DollarSign className="h-4 w-4" /> Target Amount
							</Label>
							<Input
								id="goalAmount"
								name="goalAmount"
								type="number"
								step="1.0"
								min="0"
								required
								value={formData.goalAmount || ""}
								onChange={handleChange}
								placeholder="0.00"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="goalBalance" className="flex items-center gap-2">
								<BarChart className="h-4 w-4" /> Current Balance
							</Label>
							<Input
								id="goalBalance"
								name="goalBalance"
								type="number"
								step="1.0"
								min="0"
								value={formData.goalBalance || ""}
								onChange={handleChange}
								placeholder="0.00"
							/>
							<p className="text-xs text-gray-500">
								Current progress:{" "}
								{formData.goalAmount
									? (
											((formData.goalBalance || 0) / formData.goalAmount) *
											100
									  ).toFixed(1)
									: 0}
								%
							</p>
						</div>

						<div className="grid gap-2">
							<Label
								htmlFor="goalDescription"
								className="flex items-center gap-2"
							>
								<FileText className="h-4 w-4" /> Description
							</Label>
							<Textarea
								id="goalDescription"
								name="goalDescription"
								value={formData.goalDescription || ""}
								onChange={handleChange}
								placeholder="Goal description"
								rows={2}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label
									htmlFor="goalStartDate"
									className="flex items-center gap-2"
								>
									<Calendar className="h-4 w-4" /> Start Date
								</Label>
								<Input
									id="goalStartDate"
									name="goalStartDate"
									type="date"
									required
									value={formData.goalStartDate}
									onChange={handleChange}
								/>
							</div>

							<div className="grid gap-2">
								<Label
									htmlFor="goalEndDate"
									className="flex items-center gap-2"
								>
									<Calendar className="h-4 w-4" /> End Date
								</Label>
								<Input
									id="goalEndDate"
									name="goalEndDate"
									type="date"
									required
									value={formData.goalEndDate}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="goalStatus" className="flex items-center gap-2">
								<Target className="h-4 w-4" /> Status
							</Label>
							<Select
								value={formData.goalStatus}
								onValueChange={(value: string) =>
									handleSelectChange("goalStatus", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="paused">Paused</SelectItem>
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

export default EditGoalDialog;
