type goalTypes = {
	_id: string;
	user: string;
	goalAmount: number;
	goalName: string;
	goalDescription?: string | null;
	goalIcon: string | null;
	goalStartDate: string;
	goalEndDate: string;
	goalStatus: string;
	goalBalance: number;
	transactions?: [
		{
			_id: string;
			user: string;
			amount: number;
			name: string;
			description?: string;
			transactionIcon?: string;
			type: string;
			createdAt: string;
		}
	];
	createdAt?: string;
	updatedAt?: string;
};

export type { goalTypes };
