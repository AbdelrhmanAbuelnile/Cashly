import axiosInstance from "./axios";
import { ExpenseItemStatus } from "@/types/expenseCollectionTypes";

interface myCollectionsQuery {
	limit?: number;
	page?: number;
	sort?: string;
	order?: string;
	search?: string;
}

interface CollectionData {
	name: string;
	icon?: string;
	description?: string;
}

interface ItemData {
	name: string;
	amount: number;
	note?: string;
	status?: ExpenseItemStatus;
}

const ExpenseCollectionsApi = {
	createCollection: (data: CollectionData) => {
		return axiosInstance.post(`/expense-collection/new`, data);
	},
	updateCollection: (collectionId: string, data: CollectionData) => {
		return axiosInstance.put(`/expense-collection/${collectionId}`, data);
	},
	deleteCollection: (collectionId: string) => {
		return axiosInstance.delete(`/expense-collection/${collectionId}`);
	},
	getMyCollections: (query: myCollectionsQuery) => {
		return axiosInstance.get(`/expense-collection`, { params: query });
	},
	getCollection: (collectionId: string) => {
		return axiosInstance.get(`/expense-collection/${collectionId}`);
	},
	createItem: (collectionId: string, data: ItemData) => {
		return axiosInstance.post(`/expense-collection/${collectionId}/item`, data);
	},
	updateItem: (collectionId: string, itemId: string, data: ItemData) => {
		return axiosInstance.put(
			`/expense-collection/${collectionId}/item/${itemId}`,
			data
		);
	},
	updateItemStatus: (
		collectionId: string,
		itemId: string,
		status: ExpenseItemStatus
	) => {
		return axiosInstance.patch(
			`/expense-collection/${collectionId}/item/${itemId}/status`,
			{ status }
		);
	},
	deleteItem: (collectionId: string, itemId: string) => {
		return axiosInstance.delete(
			`/expense-collection/${collectionId}/item/${itemId}`
		);
	},
};

export default ExpenseCollectionsApi;
