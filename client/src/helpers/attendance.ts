function calculateAttendancePeriods(
	startTime: Date,
	endTime: Date,
	times: Date[]
) {
	const ACCURACY = 5 * 60 * 1000;

	const periods: {
		start: Date;
		end: Date;
	}[] = [];

	const startTimestamp = startTime.getTime();
	const endTimestamp = endTime.getTime();

	let currentStart = null;
	let currentEnd = null;

	for (const time of times) {
		const timestamp = time.valueOf();

		if (timestamp < startTimestamp || timestamp > endTimestamp) {
			continue;
		} else if (!currentStart || !currentEnd) {
			currentStart = Math.max(timestamp - ACCURACY, startTimestamp);
			currentEnd = Math.min(timestamp + ACCURACY, endTimestamp);
		} else if (timestamp - currentEnd > ACCURACY) {
			periods.push({
				start: new Date(currentStart),
				end: new Date(currentEnd),
			});

			currentEnd = Math.min(timestamp + ACCURACY, endTimestamp);
			currentStart = Math.max(timestamp - ACCURACY, startTimestamp);
		} else {
			currentEnd = Math.min(timestamp + ACCURACY, endTimestamp);
		}
	}

	if (currentStart && currentEnd) {
		periods.push({
			start: new Date(currentStart),
			end: new Date(currentEnd),
		});
	}

	return periods;
}

function calculateAttendancePercentage(
	startTime: Date,
	endTime: Date,
	periods: {
		start: Date;
		end: Date;
	}[]
) {
	const total = endTime.getTime() - startTime.getTime();

	let attended = 0;

	for (const period of periods) {
		attended += period.end.getTime() - period.start.getTime();
	}

	return (attended / total) * 100;
}

export function calculateAttendance(
	startTime: Date,
	endTime: Date,
	times: Date[]
) {
	const periods = calculateAttendancePeriods(startTime, endTime, times);
	const percentage = calculateAttendancePercentage(
		startTime,
		endTime,
		periods
	);

	return {
		periods,
		percentage,
	};
}
