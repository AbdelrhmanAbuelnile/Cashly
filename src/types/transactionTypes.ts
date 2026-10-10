type TransactionTypes = {
	_id: string;
	user: string;
	amount: number;
	name: string;
	type: string;
	createdAt: string;
	description?: string;
	transactionIcon?: string;
	expenseCollection?: {
		_id: string;
		name: string;
		icon?: string;
	} | null;
};

export type { TransactionTypes };
