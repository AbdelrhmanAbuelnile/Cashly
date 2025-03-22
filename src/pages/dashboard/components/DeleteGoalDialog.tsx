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

interface DeleteGoalDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	goalName: string;
}

const DeleteGoalDialog: React.FC<DeleteGoalDialogProps> = ({
	open,
	onOpenChange,
	onConfirm,
	goalName,
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
						Delete Goal
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="py-4">
					Are you sure you want to delete{" "}
					<span className="font-semibold">{goalName}</span>? This action cannot
					be undone and all associated contributions will be deleted.
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
						Delete Goal
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteGoalDialog;
