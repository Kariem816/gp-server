import { cn } from "~/utils";

function LoadingBar({ value }: { value: number }) {
	return (
		<div className="h-5 bg-accent rounded-full border border-accent-foreground overflow-hidden">
			<div
				className={cn(
					"h-full transition-all duration-500 ease-in-out",
					value > 33?
						 value > 66?
						 value > 80?
							 "bg-red-500"
							 :"bg-orange-500"
						: "bg-yellow-500"
					: "bg-green-500	"
				)}
				style={{
					width: `${value}%`,
				}}
			/>
		</div>
	);
}


export default LoadingBar;
