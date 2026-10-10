import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	PlusCircle,
	Folder,
	Heart,
	Home,
	Car,
	Briefcase,
	Plane,
	PartyPopper,
	Loader2,
} from "lucide-react";
import { ExpenseCollectionTypes } from "@/types/expenseCollectionTypes";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import ExpenseCollectionsApi from "@/api/ExpenseCollections";
import { useAuth } from "@/hooks/useAuth";

// Function to render icon based on the collection's icon string
const renderIcon = (iconName: string) => {
	switch (iconName.toLowerCase()) {
		case "heart":
			return <Heart className="h-6 w-6" />;
		case "home":
			return <Home className="h-6 w-6" />;
		case "car":
			return <Car className="h-6 w-6" />;
		case "briefcase":
			return <Briefcase className="h-6 w-6" />;
		case "plane":
			return <Plane className="h-6 w-6" />;
		case "party":
			return <PartyPopper className="h-6 w-6" />;
		default:
			return <Folder className="h-6 w-6" />;
	}
};

// New Collection button component - reusable
const NewCollectionButton = ({
	className = "",
	large = false,
}: {
	className?: string;
	large?: boolean;
}) => (
	<Link to="/dashboard/expense-collections/new" className={className}>
		<button
			className={`group bg-[#543A14] text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
				large ? "p-4" : ""
			}`}
		>
			<div className="flex items-center">
				<PlusCircle className={`${large ? "h-8 w-8" : "h-6 w-6"}`} />
				<span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
					New List
				</span>
			</div>
		</button>
	</Link>
);

function ExpenseCollections() {
	const { user } = useAuth();

	// Fetch expense collections with React Query
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["expense-collections"],
		queryFn: () => ExpenseCollectionsApi.getMyCollections({ limit: 20 }),
		select: (response) => response.data,
	});

	// Handle loading state
	if (isLoading) {
		return (
			<div className="container h-screen flex justify-center items-center text-center">
				<Loader2 size={64} className="animate-spin" />
			</div>
		);
	}

	// Handle error state
	if (isError) {
		return (
			<div className="container mx-auto py-4 text-center text-red-500">
				Error loading expense lists:{" "}
				{error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	const collections: ExpenseCollectionTypes[] = data?.collections || [];

	// Empty state with prominent new collection button
	if (collections.length === 0) {
		return (
			<div className="container mx-auto py-4">
				<div className="flex flex-col items-center justify-center py-16">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							No expense lists yet
						</h2>
						<p className="text-gray-600 max-w-md">
							Group related expenses together — like "Wedding" or "House
							Renovation" — and track what's paid, agreed, or still being
							priced, all in one place.
						</p>
					</div>
					<NewCollectionButton large={true} />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-4">
			<div className="mb-6">
				<p className="text-gray-600">
					Group related expenses together, whatever the category, and track
					what's paid and what's not.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{collections.map((collection) => {
					const totalAmount = collection.totalAmount || 0;
					const paidAmount = collection.paidAmount || 0;
					const progressPercentage =
						totalAmount > 0
							? Math.min(Math.floor((paidAmount / totalAmount) * 100), 100)
							: 0;

					return (
						<Link
							to={`/dashboard/expense-collections/${collection._id}`}
							key={collection._id}
							className="block transition-transform hover:scale-105"
						>
							<Card className="h-full bg-[#F0BB78] flex flex-col justify-between">
								<CardHeader className="flex flex-row items-center gap-2">
									<div className="bg-[#543A14]/10 p-2 rounded-full">
										{renderIcon(collection.icon || "")}
									</div>
									<div>
										<CardTitle className="text-[#543A14] font-semibold">
											{collection.name}
										</CardTitle>
										<CardDescription className="text-sm text-black">
											{collection.itemCount || 0}{" "}
											{collection.itemCount === 1 ? "item" : "items"}
										</CardDescription>
									</div>
								</CardHeader>

								<CardContent className="text-black">
									{collection.description && (
										<p className="text-sm line-clamp-2">
											{collection.description}
										</p>
									)}
								</CardContent>

								<CardFooter className="flex flex-col gap-2 items-stretch">
									<div className="flex justify-between text-sm text-white">
										<span>
											{formatCurrency(paidAmount, user?.currency)} paid
										</span>
										<span>
											{formatCurrency(totalAmount, user?.currency)} total
										</span>
									</div>
									<Progress value={progressPercentage} className="h-2" />
								</CardFooter>
							</Card>
						</Link>
					);
				})}
			</div>

			{/* Add New Collection Button (fixed to bottom right) */}
			<div className="fixed bottom-6 right-6 z-10">
				<NewCollectionButton />
			</div>
		</div>
	);
}

export default ExpenseCollections;
