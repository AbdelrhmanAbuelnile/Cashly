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

interface DeleteExpenseItemDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	itemName: string;
	isPaid: boolean;
}

const DeleteExpenseItemDialog: React.FC<DeleteExpenseItemDialogProps> = ({
	open,
	onOpenChange,
	onConfirm,
	itemName,
	isPaid,
}) => {
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
						Delete Expense
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="py-4">
					Are you sure you want to delete{" "}
					<span className="font-semibold">{itemName}</span>? This action
					cannot be undone.
					{isPaid && (
						<>
							{" "}
							This expense was marked as paid — deleting it will also remove
							its transaction and add the amount back to your balance.
						</>
					)}
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
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteExpenseItemDialog;
