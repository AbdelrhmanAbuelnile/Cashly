import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Types for notification permission and subscription
interface NotificationPermission {
	status: "granted" | "denied" | "default";
}

interface CustomPushSubscription {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

const PushNotificationManager: React.FC = () => {
	const [permission, setPermission] =
		useState<NotificationPermission["status"]>("default");
	const navigate = useNavigate();

	// Request notification permission
	const requestNotificationPermission = async () => {
		try {
			const result = await Notification.requestPermission();
			setPermission(result);

			if (result === "granted") {
				await subscribeUserToPush();
			}
		} catch (error) {
			console.error("Error requesting notification permission:", error);
		}
	};

	// Subscribe user to push notifications
	const subscribeUserToPush = async () => {
		try {
			// Check if service worker is registered
			const registration = await navigator.serviceWorker.ready;

			// Public VAPID key (replace with your actual public key)
			const publicVapidKey =
				"BPANyPIVJMqc8hSThVWjzulnV8mz3UE5G2b6KUjzfH9fLaaZrZn5_8BI6KHXwGM3uBaRaWgKEhCONV1gVhrWefU";

			// Convert VAPID key to Uint8Array
			const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

			// Subscribe to push notifications
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: convertedVapidKey,
			});

			// Send subscription to backend
			const customSubscription: CustomPushSubscription = {
				endpoint: subscription.endpoint,
				keys: {
					p256dh: subscription.getKey("p256dh")
						? btoa(
								String.fromCharCode(
									...new Uint8Array(subscription.getKey("p256dh")!)
								)
						  )
						: "",
					auth: subscription.getKey("auth")
						? btoa(
								String.fromCharCode(
									...new Uint8Array(subscription.getKey("auth")!)
								)
						  )
						: "",
				},
			};
			await sendSubscriptionToBackend(customSubscription);
		} catch (error) {
			console.error("Error subscribing to push notifications:", error);
		}
	};

	// Send subscription details to backend
	const sendSubscriptionToBackend = async (
		subscription: CustomPushSubscription
	) => {
		try {
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});

			if (!response.ok) {
				throw new Error("Failed to send subscription to backend");
			}
		} catch (error) {
			console.error("Error sending subscription to backend:", error);
		}
	};

	// Helper to convert VAPID key
	const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/\\-/g, "+")
			.replace(/_/g, "/");

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	};

	// Trigger notification to open transaction page
	const triggerTransactionNotification = async () => {
		if (permission === "granted") {
			// This would typically be sent from your backend
			const notification = new Notification("Time to Log Transactions", {
				body: "Tap to enter your daily transactions",
				icon: "/path-to-your-icon.png",
				tag: "transaction-reminder",
			});

			notification.onclick = () => {
				navigate("/dashboard/new-transaction");
			};
		}
	};

	useEffect(() => {
		// Check initial permission status
		setPermission(Notification.permission);

		// Setup service worker for push notifications
		const setupServiceWorker = async () => {
			if ("serviceWorker" in navigator) {
				try {
					await navigator.serviceWorker.register("/service-worker.js");
				} catch (error) {
					console.error("Service Worker registration failed:", error);
				}
			}
		};

		setupServiceWorker();
	}, []);

	return (
		<div>
			{permission === "default" && (
				<button onClick={requestNotificationPermission}>
					Enable Notifications
				</button>
			)}
			{permission === "granted" && (
				<button onClick={triggerTransactionNotification}>
					Send Transaction Reminder
				</button>
			)}
		</div>
	);
};

export default PushNotificationManager;
