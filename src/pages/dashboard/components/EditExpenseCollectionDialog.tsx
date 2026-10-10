import React, { useEffect, useState } from "react";
import { Folder, Heart, Home, Car, Briefcase, Plane, PartyPopper, FileText } from "lucide-react";
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
import { ExpenseCollectionTypes } from "@/types/expenseCollectionTypes";

export interface EditCollectionFormData {
	name: string;
	icon: string;
	description: string;
}

interface EditExpenseCollectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: EditCollectionFormData) => Promise<void> | void;
	collection: ExpenseCollectionTypes;
}

const iconOptions = [
	{ value: "folder", label: "General", icon: <Folder className="h-5 w-5" /> },
	{ value: "heart", label: "Wedding", icon: <Heart className="h-5 w-5" /> },
	{ value: "home", label: "Home / Renovation", icon: <Home className="h-5 w-5" /> },
	{ value: "car", label: "Vehicle", icon: <Car className="h-5 w-5" /> },
	{ value: "briefcase", label: "Work / Business", icon: <Briefcase className="h-5 w-5" /> },
	{ value: "plane", label: "Travel", icon: <Plane className="h-5 w-5" /> },
	{ value: "party", label: "Event / Party", icon: <PartyPopper className="h-5 w-5" /> },
];

const EditExpenseCollectionDialog: React.FC<EditExpenseCollectionDialogProps> = ({
	open,
	onOpenChange,
	onSubmit,
	collection,
}) => {
	const [formData, setFormData] = useState<EditCollectionFormData>({
		name: "",
		icon: "folder",
		description: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (collection && open) {
			setErrors({});
			setFormData({
				name: collection.name || "",
				icon: collection.icon || "folder",
				description: collection.description || "",
			});
		}
	}, [collection, open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleIconChange = (value: string) => {
		setFormData((prev) => ({ ...prev, icon: value }));
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "List name is required";
		} else if (formData.name.length > 100) {
			newErrors.name = "List name must be 100 characters or fewer";
		}

		if (formData.description.length > 500) {
			newErrors.description = "Description must be 500 characters or fewer";
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
					<DialogTitle className="text-xl font-bold">Edit Expense List</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">List Name</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="e.g., Wedding, House Renovation"
								className={errors.name ? "border-red-500" : ""}
								maxLength={100}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="icon">Icon</Label>
							<Select value={formData.icon} onValueChange={handleIconChange}>
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

						<div className="grid gap-2">
							<Label htmlFor="description" className="flex items-center gap-2">
								<FileText className="h-4 w-4" /> Description
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="What is this list for?"
								rows={2}
								className={errors.description ? "border-red-500" : ""}
								maxLength={500}
							/>
							{errors.description && (
								<p className="text-red-500 text-sm">{errors.description}</p>
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
							{submitting ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditExpenseCollectionDialog;
