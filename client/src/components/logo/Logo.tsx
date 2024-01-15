import LogoImg from "~/assets/logo.svg";
import styles from "./style.module.css";

type LogoProps = {
	className?: string;
	size?: number;
};

function Logo({ className, size }: LogoProps) {
	return (
		<div className={styles.logo}>
			<img src={LogoImg} alt="logo" height={size} width={size} />
			<p>Smart Campus</p>
		</div>
	);
}

export default Logo;
