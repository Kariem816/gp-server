import { useMemo } from "react";
import { Periods } from "./periods";
import { Times } from "./times";
import { TimeAxis } from "./time-axis";

import type { AttendanceTimeline } from ".";
import { Legend } from "./legend";

const THRESHOLD = 1000 * 3; // 3 seconds

export function AttendanceGraph({
	times,
	periods,
	timeline,
	percentage,
}: {
	times: Date[];
	periods: { start: Date; end: Date }[];
	timeline: AttendanceTimeline;
	percentage: number;
}) {
	const uncatched = useMemo(
		() =>
			timeline.imgs.filter((img) => {
				let matched = 0;
				for (const time of times) {
					if (
						img.getTime() > time.getTime() - THRESHOLD &&
						img.getTime() < time.getTime() + THRESHOLD
					) {
						matched++;
					}
				}
				return matched === 0;
			}),
		[times, timeline.imgs]
	);

	return (
		<div className="border-2 rounded-md mx-1">
			<div className="h-36 relative">
				<Periods
					periods={periods}
					start={timeline.start}
					end={timeline.end}
				/>
				<Times
					times={uncatched}
					start={timeline.start}
					end={timeline.end}
					className="bg-red-500"
				/>
				<Times
					times={times}
					start={timeline.start}
					end={timeline.end}
					className="bg-green-500"
				/>
			</div>
			<TimeAxis start={timeline.start} end={timeline.end} />
			<Legend
				catched={uncatched.length !== timeline.imgs.length}
				uncatched={uncatched.length > 0}
				attended={percentage > 0}
				absent={percentage < 100}
			/>
		</div>
	);
}
