import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Target,
	Plane,
	Wallet,
	ShoppingBag,
	Home,
	Goal,
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
import GoalsApi from "@/api/Goals";
import { useSnackbar } from "@/hooks/useSnackbar";

interface GoalData {
	name: string;
	icon?: string;
	amount: number;
	description?: string;
	startDate?: string;
	endDate: string;
	status?: string;
	goalBalance?: number;
}

function NewGoal() {
	const navigate = useNavigate();
	const showSnackbar = useSnackbar();

	const today = new Date().toISOString().split("T")[0];

	const [formData, setFormData] = useState<GoalData>({
		name: "",
		icon: "target",
		amount: 0,
		description: "",
		startDate: today,
		endDate: "",
		status: "active",
		goalBalance: 0,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		if (name === "amount" || name === "goalBalance") {
			if (value === "") {
				setFormData({ ...formData, [name]: 0 });
				return;
			}
			const newVal = parseFloat(value);
			if (isNaN(newVal)) {
				return;
			} else {
				setFormData({ ...formData, [name]: newVal });
			}
		} else {
			setFormData({ ...formData, [name]: value });
		}
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({ ...formData, [name]: value });

		// Clear error when user makes a selection
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Goal name is required";
		}

		if (formData.amount <= 0) {
			newErrors.amount = "Amount must be greater than zero";
		}

		if (!formData.endDate) {
			newErrors.endDate = "End date is required";
		} else if (
			formData.startDate &&
			new Date(formData.endDate) <= new Date(formData.startDate)
		) {
			newErrors.endDate = "End date must be after start date";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (validateForm()) {
			console.log(formData);
			GoalsApi.createGoal(formData)
				.then(() => {
					navigate("/dashboard/goals");
					showSnackbar("Goal Created successfully", {
						type: "success",
						title: "Success",
						duration: 5000,
					});
				})
				.catch((error) => {
					console.error(error);
					setLoading(false);
					showSnackbar(error.response.data.message || "Failed to create goal", {
						type: "error",
						title: "Error",
						duration: 5000,
					});
				});
		}
	};

	const iconOptions = [
		{ value: "target", label: "Target", icon: <Target className="h-5 w-5" /> },
		{ value: "plane", label: "Travel", icon: <Plane className="h-5 w-5" /> },
		{ value: "wallet", label: "Savings", icon: <Wallet className="h-5 w-5" /> },
		{
			value: "shopping",
			label: "Shopping",
			icon: <ShoppingBag className="h-5 w-5" />,
		},
		{ value: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
		{ value: "goal", label: "General", icon: <Goal className="h-5 w-5" /> },
	];

	const statusOptions = [
		{ value: "active", label: "Active" },
		{ value: "paused", label: "Paused" },
	];

	return (
		<div className="container mx-auto py-8 px-4">
			<Button
				variant="ghost"
				className="mb-6 flex items-center gap-2"
				onClick={() => navigate("/dashboard/goals")}
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Goals
			</Button>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Goal</CardTitle>
					<CardDescription>
						Set a new financial goal to help you track your progress
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Goal Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="e.g., New Car, Emergency Fund"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="icon">Goal Icon</Label>
							<Select
								value={formData.icon}
								onValueChange={(value: string) =>
									handleSelectChange("icon", value)
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
							<Label htmlFor="amount">Target Amount *</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2">
									$
								</span>
								<Input
									id="amount"
									name="amount"
									type="number"
									min="0"
									step="0.01"
									value={formData.amount}
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
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="What is this goal for? Add details to help you stay motivated."
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="startDate">Start Date</Label>
								<Input
									id="startDate"
									name="startDate"
									type="date"
									value={formData.startDate}
									onChange={handleInputChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="endDate">Target End Date *</Label>
								<Input
									id="endDate"
									name="endDate"
									type="date"
									value={formData.endDate}
									onChange={handleInputChange}
									className={errors.endDate ? "border-red-500" : ""}
								/>
								{errors.endDate && (
									<p className="text-red-500 text-sm">{errors.endDate}</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={formData.status}
								onValueChange={(value: string) =>
									handleSelectChange("status", value)
								}
							>
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
						</div>

						<div className="space-y-2">
							<Label htmlFor="goalBalance">Starting Balance (optional)</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2">
									$
								</span>
								<Input
									id="goalBalance"
									name="goalBalance"
									type="number"
									min="0"
									step="0.01"
									value={formData.goalBalance || 0}
									onChange={handleInputChange}
									className="pl-8"
									placeholder="0.00"
								/>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/dashboard/goals")}
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
								"Create Goal"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default NewGoal;
