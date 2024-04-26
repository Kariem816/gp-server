import { useTranslation } from "~/contexts/translation";
import { cn } from "~/utils";

export function Times({
	times,
	start,
	end,
	className,
}: {
	times: Date[];
	start: Date;
	end: Date;
	className: string;
}) {
	const { isRTL } = useTranslation();

	return (
		<>
			{times.map((time) => {
				const offset =
					((time.getTime() - start.getTime()) /
						(end.getTime() - start.getTime())) *
					100;
				return (
					<div
						key={time.getTime()}
						className={cn("absolute h-full w-0.5", className)}
						title={time.toLocaleTimeString([], { hour12: true })}
						style={{
							left: isRTL ? undefined : `${offset}%`,
							right: isRTL ? `${offset}%` : undefined,
						}}
					></div>
				);
			})}
		</>
	);
}
