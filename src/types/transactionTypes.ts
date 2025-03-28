type TransactionTypes = {
	_id: string;
	user: string;
	amount: number;
	name: string;
	type: string;
	createdAt: string;
	description?: string;
	transactionIcon?: string;
};

export type { TransactionTypes };
