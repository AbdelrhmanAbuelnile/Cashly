import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
			manifest: {
				name: "Cashly - Expense Tracker",
				short_name: "Cashly",
				description: "Track and manage your personal expenses",
				theme_color: "#F0BB78",
				icons: [
					{
						src: "/images/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/images/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				shortcuts: [
					{
						name: "Where did my money go?",
						short_name: "Expenses",
						description: "View your expenses",
						url: "/dashboard/transactions?source=pwa",
						icons: [
							{
								src: "/images/android-chrome-192x192.png",
								sizes: "192x192",
							},
						],
					},
					{
						name: "How much did I save?",
						short_name: "Savings",
						description: "View your savings",
						url: "/dashboard/goals?source=pwa",
						icons: [
							{
								src: "/images/android-chrome-192x192.png",
								sizes: "192x192",
							},
						],
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
