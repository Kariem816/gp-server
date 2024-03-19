import LogoImg from "~/assets/logo.svg";
import { cn } from "~/utils";

type LogoProps = {
	className?: string;
	size?: number;
	withImg?: boolean;
};

function Logo({ className, size, withImg = false }: LogoProps) {
	return (
		<div className={cn("flex items-center gap-1", className)}>
			<img
				className={withImg ? "" : "hidden"}
				src={LogoImg}
				alt="logo"
				height={size}
				width={size}
			/>
			<span className="font-semibold text-xl">Smart Campus</span>
		</div>
	);
}

export default Logo;
