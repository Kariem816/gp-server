import { Expo } from "expo-server-sdk";
import { env } from "@/config/env.js";

import type {
	ExpoPushToken,
	ExpoPushMessage,
	ExpoPushTicket,
} from "expo-server-sdk";

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

export async function sendNotifications(
	pushTokens: ExpoPushToken[],
	config: Omit<ExpoPushMessage, "to">
) {
	let messages: ExpoPushMessage[] = [];
	for (const pushToken of pushTokens) {
		if (!Expo.isExpoPushToken(pushToken)) {
			console.error(
				`Push token ${pushToken} is not a valid Expo push token`
			);
			continue;
		}

		messages.push({
			to: pushToken,
			sound: "default",
			...config,
		});
	}

	const chunks = expo.chunkPushNotifications(messages);
	let tickets = [];

	for (const chunk of chunks) {
		try {
			const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			tickets.push(...ticketChunk);
		} catch (error) {
			console.error(error);
		}
	}

	return tickets;
}

// TODO: Test this function
export async function getReceipts(tickets: ExpoPushTicket[]) {
	let receiptIds = [];
	for (const ticket of tickets) {
		if ("id" in ticket) {
			receiptIds.push(ticket.id);
		}
	}

	const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

	for (const chunk of receiptIdChunks) {
		try {
			const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

			for (const receiptId in receipts) {
				let { status, message, details } = receipts[receiptId];
				if (status === "ok") {
					continue;
				} else if (status === "error") {
					console.error(
						`There was an error sending a notification: ${message}`
					);
					if (details?.error) {
						console.error(`The error code is ${details.error}`);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
}
