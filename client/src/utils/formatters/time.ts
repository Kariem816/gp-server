function parseDate(value: string | number | Date): Date {
	if (typeof value === "string") {
		return new Date(value);
	}

	if (typeof value === "number") {
		return new Date(value);
	}

	return value;
}

export function relative(
	value: Date | number | string,
	locale: string | undefined = undefined
) {
	value = parseDate(value);
	const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
		style: "long",
	});

	const now = Date.now();
	const diff = now - value.getTime();

	if (Math.abs(diff) < 1000) {
		return "just now";
	}

	if (Math.abs(diff) < 1000 * 60) {
		return relativeFormatter.format(Math.round(-diff / 1000), "second");
	}

	if (Math.abs(diff) < 1000 * 60 * 60) {
		return relativeFormatter.format(
			Math.round(-diff / 1000 / 60),
			"minute"
		);
	}

	if (Math.abs(diff) < 1000 * 60 * 60 * 24) {
		return relativeFormatter.format(
			Math.round(-diff / 1000 / 60 / 60),
			"hour"
		);
	}

	if (Math.abs(diff) < 1000 * 60 * 60 * 24 * 30) {
		return relativeFormatter.format(
			Math.round(-diff / 1000 / 60 / 60 / 24),
			"day"
		);
	}

	if (Math.abs(diff) < 1000 * 60 * 60 * 24 * 30 * 12) {
		return relativeFormatter.format(
			Math.round(-diff / 1000 / 60 / 60 / 24 / 30),
			"month"
		);
	}

	return relativeFormatter.format(
		Math.round(-diff / 1000 / 60 / 60 / 24 / 30 / 12),
		"year"
	);
}

export function time(
	value: Date | number | string,
	locale: string | undefined = undefined
) {
	value = parseDate(value);
	const f = new Intl.DateTimeFormat(locale, {
		hour: "numeric",
		minute: "numeric",
	});
	return f.format(value);
}

export function absolute(
	date1: Date | number | string,
	date2: Date | number | string
) {
	date1 = parseDate(date1);
	date2 = parseDate(date2);

	const diff = date2.getTime() - date1.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	const secondsLeft = seconds % 60;
	const minutesLeft = minutes % 60;

	if (hours === 0) {
		return `${minutesLeft} : ${secondsLeft.toString().padStart(2, "0")}`;
	}

	return `${hours} : ${minutesLeft
		.toString()
		.padStart(2, "0")} : ${secondsLeft.toString().padStart(2, "0")}`;
}

export function date(
	value: Date | number | string,
	locale: string | undefined = undefined
) {
	value = parseDate(value);
	const f = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	return f.format(value);
}

export function dateTime(
	value: Date | number | string,
	locale: string | undefined = undefined
) {
	value = parseDate(value);
	const f = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	return f.format(value);
}
