import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date);
}

export function formatCurrency(amount: number, currency?: string | null) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency || "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function cropText(text: string, maxLength: number) {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}

export const validateTransactionType = (type: string) => {
	if (type.trim() !== type) {
		return { message: "Invalid transaction type" };
	}

	const transactionType: string = type.toLowerCase();

	const validTypes = [
		"income",
		"expense",
		"transfer",
		"loan",
		"borrow",
		"repay",
		"investment",
		"withdraw",
		"deposit",
		"refund",
		"fee",
		"tax",
		"salary",
		"bonus",
		"interest",
		"dividend",
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

	if (!validTypes.includes(transactionType)) {
		return { message: "Invalid transaction type" };
	}

	if (incomeTypes.includes(transactionType)) {
		return "income";
	}

	if (expenseTypes.includes(transactionType)) {
		return "expense";
	}

	return undefined;
};

export const transactionTypes = [
	"income",
	"expense",
	"transfer",
	"loan",
	"borrow",
	"repay",
	"investment",
	"withdraw",
	"deposit",
	"refund",
	"fee",
	"tax",
	"salary",
	"bonus",
	"interest",
	"dividend",
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
