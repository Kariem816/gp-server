import LogoImg from "~/assets/logo.svg";
import styles from "./style.module.css";
import { cn } from "~/utils";

type LogoProps = {
	className?: string;
	size?: number;
};

function Logo({ className, size }: LogoProps) {
	return (
		<div className={cn(styles.logo, className)}>
			<img src={LogoImg} alt="logo" height={size} width={size} />
			<span className="hidden sm:block">Smart Campus</span>
		</div>
	);
}

export default Logo;
