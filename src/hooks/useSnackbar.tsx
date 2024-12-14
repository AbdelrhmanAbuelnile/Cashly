import React, {
	createContext,
	useState,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, InfoIcon, XIcon } from "lucide-react";

// Snackbar type definitions
type SnackbarType = "success" | "error" | "warning" | "info";

// Snackbar options interface
interface SnackbarOptions {
	title?: string;
	type?: SnackbarType;
	duration?: number;
}

// Snackbar item interface
interface SnackbarItem {
	id: number;
	content: string;
	options?: SnackbarOptions;
}

// Create context with a fallback no-op function
const SnackbarContext = createContext<
	(content: string, options?: SnackbarOptions) => void
>((content) => {
	console.warn("Snackbar used without SnackbarProvider", content);
});

// Snackbar component
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

	// Type-based icon and color mapping
	const getTypeStyles = useCallback((type: SnackbarType = "info") => {
		const typeConfig = {
			success: {
				icon: CheckCircle,
				background: "bg-green-100 border-green-500",
				text: "text-green-800",
				border: "border-l-4",
			},
			error: {
				icon: X,
				background: "bg-red-100 border-red-500",
				text: "text-red-800",
				border: "border-l-4",
			},
			warning: {
				icon: AlertCircle,
				background: "bg-yellow-100 border-yellow-500",
				text: "text-yellow-800",
				border: "border-l-4",
			},
			info: {
				icon: InfoIcon,
				background: "bg-blue-100 border-blue-500",
				text: "text-blue-800",
				border: "border-l-4",
			},
		};
		return typeConfig[type];
	}, []);

	// Function to remove a specific snackbar
	const removeSnackbar = useCallback((id: number) => {
		setSnackbars((current) => current.filter((snack) => snack.id !== id));
	}, []);

	// Memoized snackbar show function
	const showSnackbar = useCallback(
		(content: string, options: SnackbarOptions = {}) => {
			const id = Date.now();
			const newSnackbar: SnackbarItem = { id, content, options };

			setSnackbars((current) => [...current, newSnackbar]);

			// Auto-remove snackbar
			const duration = options.duration || 3000;
			const timer = setTimeout(() => {
				removeSnackbar(id);
			}, duration);

			// Return a function to manually clear the snackbar if needed
			return () => {
				clearTimeout(timer);
				removeSnackbar(id);
			};
		},
		[removeSnackbar]
	);

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(() => showSnackbar, [showSnackbar]);

	return (
		<SnackbarContext.Provider value={contextValue}>
			{children}
			<div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
				<AnimatePresence>
					{snackbars.map(({ id, content, options }) => {
						const { background, text, border } = getTypeStyles(options?.type);

						return (
							<motion.div
								key={id}
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 100 }}
								transition={{ duration: 0.3 }}
								className={`
                  ${background} ${text} ${border}
                  rounded-lg shadow-lg p-4 
                  flex items-center justify-between 
                  max-w-sm w-full
                  pointer-events-auto
                  relative
                `}
							>
								<div className="flex items-center space-x-3">
									{/* <Icon className="w-5 h-5" /> */}
									<div>
										{options?.title && (
											<div className="font-semibold">{options.title}</div>
										)}
										<div>{content}</div>
									</div>
								</div>
								<button
									onClick={() => removeSnackbar(id)}
									className="ml-4 hover:bg-gray-200 rounded-full p-1 transition-colors"
								>
									<XIcon className="w-4 h-4" />
								</button>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</SnackbarContext.Provider>
	);
};

// Hook to use snackbar
export const useSnackbar = () => {
	return useContext(SnackbarContext);
};
