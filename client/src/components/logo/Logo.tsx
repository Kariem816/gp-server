import LogoImg from "~/assets/logo.svg";
import styles from "./style.module.css";
import { classnames } from "~/utils";
import { Text } from "@mantine/core";

type LogoProps = {
	className?: string;
	size?: number;
};

function Logo({ className, size }: LogoProps) {
	return (
		<div className={classnames(styles.logo, className)}>
			<img src={LogoImg} alt="logo" height={size} width={size} />
			<Text visibleFrom="sm">Smart Campus</Text>
		</div>
	);
}

export default Logo;
