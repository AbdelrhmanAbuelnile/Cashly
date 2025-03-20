import React, { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../components/ui/select";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../../components/ui/avatar";
import { Loader2, Pencil } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import ImageCropper from "../../../components/ImageCropper";
import UserApi from "../../../api/User";
import { useSnackbar } from "../../../hooks/useSnackbar";

// Currency options
const CURRENCIES = [
	{ code: "EGP", symbol: "£", title: "Egyptian Pound" },
	{ code: "SAR", symbol: "ر.س", title: "Saudi Riyal" },
	{ code: "AED", symbol: "د.إ", title: "United Arab Emirates Dirham" },
	{ code: "QAR", symbol: "ر.ق", title: "Qatari Riyal" },
	{ code: "KWD", symbol: "د.ك", title: "Kuwaiti Dinar" },
	{ code: "USD", symbol: "$", title: "United States Dollar" },
	{ code: "EUR", symbol: "€", title: "Euro" },
	{ code: "GBP", symbol: "£", title: "British Pound" },
	{ code: "JPY", symbol: "¥", title: "Japanese Yen" },
];

// Payment day options
const PAYMENT_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

interface UserSettings {
	firstName?: string;
	lastName: string;
	picture?: string;
	salary?: number;
	paymentDay?: number;
	currency: string;
	currencySymbol: string;
	balance?: number;
}

const SettingsPage: React.FC = () => {
	const { user, updateUser } = useAuth();
	const showSnackbar = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [showCropper, setShowCropper] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [settings, setSettings] = useState<UserSettings>({
		firstName: "John Doe",
		lastName: "John",
		picture: "",
		salary: 75000,
		paymentDay: 15,
		currency: "USD",
		currencySymbol: "$",
		balance: 0,
	});

	useEffect(() => {
		if (user) {
			setSettings({
				firstName: user.firstName,
				lastName: user.lastName,
				picture: user.picture,
				salary: user.salary,
				paymentDay: user.paymentDay,
				currency: user.currency,
				currencySymbol: user.currencySymbol,
				balance: user.balance,
			});
		}
	}, [user]);

	useEffect(() => {
		console.log(settings);
	}, [settings]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSettings((prev) => ({
			...prev,
			[name]: name === "salary" ? Number(value) : value,
		}));
	};

	const handleCurrencyChange = (value: string) => {
		const selectedCurrency = CURRENCIES.find((c) => c.code === value);
		if (selectedCurrency) {
			setSettings((prev) => ({
				...prev,
				currency: selectedCurrency.code,
				currencySymbol: selectedCurrency.symbol,
			}));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
				setShowCropper(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropComplete = (croppedFile: File) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			setSettings((prev) => ({
				...prev,
				picture: reader.result as string,
			}));
			setShowCropper(false);
		};
		reader.readAsDataURL(croppedFile);
	};

	const handleSave = () => {
		setLoading(true);
		UserApi.updateSettings(settings)
			.then((res) => {
				updateUser(res.data.user);
				showSnackbar("Settings updated successfully", {
					type: "success",
					title: "Success",
					duration: 5000,
				});
				setLoading(false);
			})
			.catch((err) => {
				showSnackbar(err.response.data.message, {
					type: "error",
					title: "Error",
					duration: 5000,
				});
				setLoading(false);
			});
	};

	return (
		<div
			className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
			style={{ backgroundColor: "#FFF0DC" }} // Background matching DashboardPage
		>
			{/* Profile Section */}
			<Card className="bg-[#F0BB78] text-[#543A14] border-[#543A14]/20">
				<CardHeader>
					<CardTitle className="text-[#543A14]">Profile Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative">
							<Avatar className="w-24 h-24 border-2 border-[#543A14]">
								<AvatarImage
									src={settings.picture || "/default-avatar.png"}
									alt="Profile Picture"
								/>
								<AvatarFallback className="bg-[#F0BB78] text-[#543A14]">
									{settings.firstName?.[0]}
								</AvatarFallback>
							</Avatar>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								id="profile-pic-upload"
								onChange={handleFileChange}
							/>

							{showCropper && selectedImage && (
								<ImageCropper
									imageUrl={selectedImage}
									cropComplete={handleCropComplete}
									onCancel={() => setShowCropper(false)}
								/>
							)}
							<label
								htmlFor="profile-pic-upload"
								className="absolute bottom-0 right-0 bg-[#543A14] text-[#F0BB78] p-1 rounded-full cursor-pointer"
							>
								<Pencil className="w-4 h-4" />
							</label>
						</div>
						<div className="w-full space-y-2">
							<Label className="text-[#543A14]">First Name</Label>
							<Input
								name="firstName"
								value={settings.firstName || ""}
								onChange={handleInputChange}
								placeholder="Enter full name"
								className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]"
							/>
						</div>
						<div className="w-full space-y-2">
							<Label className="text-[#543A14]">Last Name</Label>
							<Input
								name="lastName"
								value={settings.lastName}
								onChange={handleInputChange}
								placeholder="Enter first name"
								required
								className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Financial Settings Section */}
			<Card className="bg-[#F0BB78] text-[#543A14] border-[#543A14]/20">
				<CardHeader>
					<CardTitle className="text-[#543A14]">Financial Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label className="text-[#543A14]">Monthly Salary</Label>
						<div className="flex items-center">
							<span className="mr-2 text-[#543A14]">
								{settings.currencySymbol}
							</span>
							<Input
								name="salary"
								type="number"
								value={settings.salary || ""}
								onChange={handleInputChange}
								placeholder="Enter monthly salary"
								className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-[#543A14]">Currency</Label>
						<Select
							value={settings.currency}
							onValueChange={handleCurrencyChange}
						>
							<SelectTrigger className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]">
								<SelectValue placeholder="Select Currency" />
							</SelectTrigger>
							<SelectContent className="bg-[#FFF0DC] text-[#543A14]">
								{CURRENCIES.map((currency) => (
									<SelectItem
										key={currency.code}
										value={currency.code}
										className="hover:bg-[#543A14]/10"
										title={currency.title}
									>
										{currency.code} ({currency.symbol})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="text-[#543A14]">Payment Day</Label>
						<Select
							value={settings.paymentDay?.toString()}
							onValueChange={(value) =>
								setSettings((prev) => ({
									...prev,
									paymentDay: Number(value),
								}))
							}
						>
							<SelectTrigger className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]">
								<SelectValue placeholder="Select Payment Day" />
							</SelectTrigger>
							<SelectContent className="bg-[#FFF0DC] text-[#543A14]">
								{PAYMENT_DAYS.map((day) => (
									<SelectItem
										key={day}
										value={day.toString()}
										className="hover:bg-[#543A14]/10"
									>
										{day}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="text-[#543A14]">Balance</Label>
						<div className="flex items-center">
							<Input
								name="balance"
								type="number"
								value={settings.balance || ""}
								onChange={handleInputChange}
								placeholder="Enter your current balance"
								className="bg-[#FFF0DC] text-[#543A14] border-[#543A14]/30 focus:border-[#543A14]"
							/>
						</div>
					</div>

					<Button
						onClick={handleSave}
						className={`w-full mt-4 bg-[#543A14] hover:bg-[#543A14]/90 text-[#F0BB78] ${
							loading ? "cursor-not-allowed" : ""
						} `}
					>
						{loading ? (
							<>
								Saving Settings
								<Loader2 className="ml-2 w-5 h-5 animate-spin" />
							</>
						) : (
							"Save Settings"
						)}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default SettingsPage;
