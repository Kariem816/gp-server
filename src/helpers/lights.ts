




export function shouldTurnOn(): boolean {
	const now = new Date();
	return now.getHours() < 6 || now.getHours() >= 19;
}
