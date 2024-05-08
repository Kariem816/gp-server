import { TLecture } from "~/services/lectures";
import { useMemo } from "react";

export default function useLectureTime(lecture: TLecture | undefined): {
	endTime: Date | null;
	timing: -1 | 0 | 1;
} {
	const endTime = useMemo(() => {
		if (!lecture) {
			return null;
		}

		if (lecture.ended) {
			return new Date(lecture.ended);
		}

		const start = new Date(lecture.time);
		start.setMinutes(start.getMinutes() + lecture.duration);

		return start;
	}, [lecture]);

	const timing = useMemo(() => {
		if (!endTime || !lecture) {
			return -1;
		}

		if (
			new Date() > new Date(lecture.time) && // has started
			endTime > new Date() // has not ended
		) {
			return 0;
		} else if (endTime < new Date()) {
			return 1;
		} else {
			return -1;
		}
	}, [endTime, lecture]);

	return { endTime, timing };
}
