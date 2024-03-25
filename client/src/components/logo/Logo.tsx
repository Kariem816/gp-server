import LogoImg from "~/assets/logo.svg";
import { useTranslation } from "~/contexts/translations";
import { cn } from "~/utils";

type LogoProps = {
	className?: string;
	size?: number;
	withImg?: boolean;
};

function Logo({ className, size, withImg = false }: LogoProps) {
	const { t } = useTranslation();
	return (
		<div className={cn("flex items-center gap-1", className)}>
			<img
				className={withImg ? "" : "hidden"}
				src={LogoImg}
				alt="logo"
				height={size}
				width={size}
			/>
			<span className="font-semibold text-xl">{t("app_name")}</span>
		</div>
	);
}

export default Logo;
