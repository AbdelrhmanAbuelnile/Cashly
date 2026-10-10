import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Folder,
	Heart,
	Home,
	Car,
	Briefcase,
	Plane,
	PartyPopper,
	ArrowLeft,
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
import ExpenseCollectionsApi from "@/api/ExpenseCollections";
import { useSnackbar } from "@/hooks/useSnackbar";

interface CollectionFormData {
	name: string;
	icon: string;
	description: string;
}

function NewExpenseCollection() {
	const navigate = useNavigate();
	const showSnackbar = useSnackbar();

	const [formData, setFormData] = useState<CollectionFormData>({
		name: "",
		icon: "folder",
		description: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (
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

	const validateForm = (): boolean => {
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		ExpenseCollectionsApi.createCollection(formData)
			.then((response) => {
				showSnackbar("Expense list created successfully", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				navigate(`/dashboard/expense-collections/${response.data.collection._id}`);
			})
			.catch((error) => {
				setLoading(false);
				showSnackbar(
					error.response?.data?.message || "Failed to create expense list",
					{
						type: "error",
						title: "Error",
						duration: 5000,
					}
				);
			});
	};

	const iconOptions = [
		{ value: "folder", label: "General", icon: <Folder className="h-5 w-5" /> },
		{ value: "heart", label: "Wedding", icon: <Heart className="h-5 w-5" /> },
		{ value: "home", label: "Home / Renovation", icon: <Home className="h-5 w-5" /> },
		{ value: "car", label: "Vehicle", icon: <Car className="h-5 w-5" /> },
		{ value: "briefcase", label: "Work / Business", icon: <Briefcase className="h-5 w-5" /> },
		{ value: "plane", label: "Travel", icon: <Plane className="h-5 w-5" /> },
		{ value: "party", label: "Event / Party", icon: <PartyPopper className="h-5 w-5" /> },
	];

	return (
		<div className="container mx-auto py-8 px-4">
			<Button
				variant="ghost"
				className="mb-6 flex items-center gap-2"
				onClick={() => navigate("/dashboard/expense-collections")}
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Expense Lists
			</Button>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Expense List</CardTitle>
					<CardDescription>
						Group related expenses together — like "Wedding" or "House
						Renovation" — so you can track them all in one place, whatever
						their category.
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">List Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="e.g., Wedding, House Renovation"
								className={errors.name ? "border-red-500" : ""}
								maxLength={100}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
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

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="What is this list for?"
								rows={3}
								className={errors.description ? "border-red-500" : ""}
								maxLength={500}
							/>
							{errors.description && (
								<p className="text-red-500 text-sm">{errors.description}</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/dashboard/expense-collections")}
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
								"Create List"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default NewExpenseCollection;
