import trashStore from "@/models/trash.model";
import { sendNotifications } from "./notifications";

function getNotificationBody(location: string, cans: number[]) {
	const level = Math.max(...cans);

	if (level > 90) {
		return `${cans.length} trash cans at ${location} need to be emptied. Please take action immediately.`;
	} else if (level > 80) {
		return `${cans.length} trash cans at ${location} are almost full. Please take action soon.`;
	} else {
		return `${cans.length} trash cans at ${location} need to be checked.`;
	}
}

export async function notifyFilledTrash(
	trash: Array<{ location: string; level: number }>
) {
	// Risky code we let the caller handle the error
	const tokens = await trashStore.getSecurityNotifications();
	if (!tokens.length) {
		throw new Error("No security tokens found");
	}

	const groupedTrash = trash.reduce((acc, curr) => {
		if (!acc[curr.location]) {
			acc[curr.location] = [];
		}
		acc[curr.location].push(curr.level);
		return acc;
	}, {} as Record<string, number[]>);

	const notifications = Object.entries(groupedTrash).map(
		([location, levels]) => ({
			title: "Trash Level Notification",
			body: getNotificationBody(location, levels),
		})
	);

	const notificationPromises: Promise<any>[] = [];
	const luckyOnes: string[] = [];
	let maxPicks = 1;

	if (notifications.length > tokens.length) {
		maxPicks = Math.ceil(notifications.length / tokens.length);
	}

	for (const notification of notifications) {
		let luckyOne: string;

		while (true) {
			luckyOne = tokens[Math.floor(Math.random() * tokens.length)]!;
			if (!luckyOnes.includes(luckyOne)) {
				luckyOnes.push(luckyOne);
				break;
			} else {
				const picks = luckyOnes.filter(
					(lucky) => lucky === luckyOne
				).length;
				if (picks < maxPicks) {
					luckyOnes.push(luckyOne);
					break;
				}
			}
		}
		const notificationPromise = sendNotifications([luckyOne], notification);
		notificationPromises.push(notificationPromise);
	}

	await Promise.all(notificationPromises);

	return [...new Set(luckyOnes)];
}
