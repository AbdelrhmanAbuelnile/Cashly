import React from "react";
import { AlertTriangle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteExpenseCollectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	collectionName: string;
}

const DeleteExpenseCollectionDialog: React.FC<
	DeleteExpenseCollectionDialogProps
> = ({ open, onOpenChange, onConfirm, collectionName }) => {
	const handleDelete = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-500" />
						Delete Expense List
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="py-4">
					Are you sure you want to delete{" "}
					<span className="font-semibold">{collectionName}</span>? All its
					planning items will be removed. Expenses already marked as paid
					will stay in your Transactions — only their link to this list is
					removed, your balance is not affected.
				</DialogDescription>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="button" variant="destructive" onClick={handleDelete}>
						Delete List
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteExpenseCollectionDialog;
