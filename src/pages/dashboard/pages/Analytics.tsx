import { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Progress } from "../../../components/ui/progress";
import { ArrowUp, ArrowDown, Wallet, Goal, TrendingUp } from "lucide-react";
function Analytics() {
	// Sample data for expenses and income
	const expenseData = [
		{ month: "Jan", expenses: 1200, income: 1800 },
		{ month: "Feb", expenses: 1100, income: 1900 },
		{ month: "Mar", expenses: 1300, income: 1750 },
		{ month: "Apr", expenses: 1000, income: 2000 },
		{ month: "May", expenses: 1250, income: 1850 },
	];

	// Savings goals data
	const [savingsGoals] = useState([
		{
			title: "Emergency Fund",
			current: 3500,
			target: 5000,
			icon: Wallet,
		},
		{
			title: "Vacation Fund",
			current: 1200,
			target: 3000,
			icon: Goal,
		},
	]);
	return (
		<div className="flex-1 p-6">
			<div className="container mx-auto">
				<div className="grid md:grid-cols-3 gap-6">
					{/* Quick Stats Cards */}
					<Card className="bg-[#F0BB78] text-[#543A14]">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Income
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-[#543A14]" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$9,300</div>
							<p className="text-xs text-[#543A14]/70 flex items-center">
								<ArrowUp className="h-4 w-4 mr-1 text-green-600" /> 12.5% from
								last month
							</p>
						</CardContent>
					</Card>

					<Card className="bg-[#F0BB78] text-[#543A14]">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Expenses
							</CardTitle>
							<Wallet className="h-4 w-4 text-[#543A14]" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$5,670</div>
							<p className="text-xs text-[#543A14]/70 flex items-center">
								<ArrowDown className="h-4 w-4 mr-1 text-red-600" /> 3.2% from
								last month
							</p>
						</CardContent>
					</Card>

					<Card className="bg-[#F0BB78] text-[#543A14]">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Savings Rate
							</CardTitle>
							<Goal className="h-4 w-4 text-[#543A14]" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">42%</div>
							<p className="text-xs text-[#543A14]/70">
								of monthly income saved
							</p>
						</CardContent>
					</Card>

					{/* Expenses Chart */}
					<Card className="md:col-span-2 bg-[#F0BB78]/20">
						<CardHeader>
							<CardTitle>Monthly Expenses vs Income</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={expenseData}>
									<XAxis dataKey="month" stroke="#543A14" />
									<YAxis stroke="#543A14" />
									<Tooltip
										contentStyle={{
											backgroundColor: "#FFF0DC",
											borderColor: "#543A14",
										}}
									/>
									<Bar dataKey="expenses" fill="#543A14" />
									<Bar dataKey="income" fill="#F0BB78" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					{/* Savings Goals */}
					<Card className="bg-[#F0BB78]/20">
						<CardHeader>
							<CardTitle>Savings Goals</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{savingsGoals.map((goal, index) => (
								<div key={index} className="space-y-2">
									<div className="flex justify-between items-center">
										<div className="flex items-center">
											<goal.icon className="h-5 w-5 mr-2 text-[#543A14]" />
											<span>{goal.title}</span>
										</div>
										<span>
											${goal.current} / ${goal.target}
										</span>
									</div>
									<Progress
										value={(goal.current / goal.target) * 100}
										className="h-2"
									/>
								</div>
							))}
						</CardContent>
					</Card>
					<Card className="md:col-span-2 bg-[#F0BB78]/20">
						<CardHeader>
							<CardTitle>Monthly Expenses vs Income</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={expenseData}>
									<XAxis dataKey="month" stroke="#543A14" />
									<YAxis stroke="#543A14" />
									<Tooltip
										contentStyle={{
											backgroundColor: "#FFF0DC",
											borderColor: "#543A14",
										}}
									/>
									<Bar dataKey="expenses" fill="#543A14" />
									<Bar dataKey="income" fill="#F0BB78" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					{/* Savings Goals */}
					<Card className="bg-[#F0BB78]/20">
						<CardHeader>
							<CardTitle>Savings Goals</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{savingsGoals.map((goal, index) => (
								<div key={index} className="space-y-2">
									<div className="flex justify-between items-center">
										<div className="flex items-center">
											<goal.icon className="h-5 w-5 mr-2 text-[#543A14]" />
											<span>{goal.title}</span>
										</div>
										<span>
											${goal.current} / ${goal.target}
										</span>
									</div>
									<Progress
										value={(goal.current / goal.target) * 100}
										className="h-2"
									/>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Analytics;
