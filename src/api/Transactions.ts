import axiosInstance from "./axios";

interface myTransactionsQuery {
	limit?: number;
	page?: number;
	sort?: string;
	order?: string;
	search?: string;
}

interface TransactionData {
	transaction: {
		amount: number;
		name: string;
		type: string;
		description?: string;
		transactionIcon?: string;
	};
	goalId?: string;
}

const TransactionsApi = {
	createTransaction: (data: TransactionData) => {
		const endpoint = `/transaction/new`;
		return axiosInstance.post(endpoint, data);
	},
	updateTransaction: (transactionId: string, data: TransactionData) => {
		const endpoint = `/transaction/${transactionId}`;
		return axiosInstance.put(endpoint, data);
	},
	deleteTransaction: (transactionId: string) => {
		const endpoint = `/transaction/${transactionId}`;
		return axiosInstance.delete(endpoint);
	},
	getMyTransactions: (query: myTransactionsQuery) => {
		const endpoint = `/transaction`;
		return axiosInstance.get(endpoint, { params: query });
	},
	getTransaction: (transactionId: string) => {
		const endpoint = `/transaction/${transactionId}`;
		return axiosInstance.get(endpoint);
	},
};

export default TransactionsApi;
