import { cn } from "~/utils";

function LoadingBar({ value }: { value: number }) {
	return (
		<div className="h-5 bg-accent rounded-full border border-accent-foreground overflow-hidden relative">
			<div
				className={cn(
					"h-full transition-all duration-500 ease-in-out",
					value > 33
						? value > 66
							? value > 80
								? "bg-red-500 text-white"
								: "bg-orange-500 text-white"
							: "bg-yellow-500 text-red-800"
						: "bg-green-500"
				)}
				style={{
					width: `${value}%`,
				}}
			>
				<span className="absolute inset-0 grid place-items-center text-sm">
					{value} %
				</span>
			</div>
		</div>
	);
}

export default LoadingBar;
