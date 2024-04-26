import { useTranslation } from "~/contexts/translation";

export function Periods({
	periods,
	start,
	end,
}: {
	periods: { start: Date; end: Date }[];
	start: Date;
	end: Date;
}) {
	const { isRTL } = useTranslation();

	return (
		<>
			{periods.map((period) => {
				const offset =
					((period.start.getTime() - start.getTime()) /
						(end.getTime() - start.getTime())) *
					100;
				const width =
					((period.end.getTime() - period.start.getTime()) /
						(end.getTime() - start.getTime())) *
					100;

				return (
					<div
						key={period.start.getTime()}
						className="absolute bg-gray-200 h-full"
						style={{
							left: isRTL ? undefined : `${offset}%`,
							right: isRTL ? `${offset}%` : undefined,
							width: `${width}%`,
						}}
					></div>
				);
			})}
		</>
	);
}
