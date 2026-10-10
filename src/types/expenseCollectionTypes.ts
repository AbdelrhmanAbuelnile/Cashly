type ExpenseItemStatus = "pending" | "asked" | "agreed" | "paid";

type ExpenseItemTypes = {
	_id: string;
	user: string;
	expenseCollection: string;
	name: string;
	amount: number;
	note?: string | null;
	status: ExpenseItemStatus;
	transaction?: string | null;
	paidAt?: string | null;
	createdAt: string;
	updatedAt: string;
};

type ExpenseCollectionTypes = {
	_id: string;
	user: string;
	name: string;
	icon?: string | null;
	description?: string | null;
	createdAt: string;
	updatedAt: string;
	// Only present on the list endpoint (computed via aggregation)
	itemCount?: number;
	totalAmount?: number;
	paidAmount?: number;
};

export type { ExpenseItemStatus, ExpenseItemTypes, ExpenseCollectionTypes };
