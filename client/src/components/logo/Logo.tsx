import LogoImg from "~/assets/logo.svg";
import { useTranslation } from "~/contexts/translations";
import { cn } from "~/utils";

type LogoProps = {
	containerClassName?: string;
	imgClassName?: string;
	titleClassName?: string;
	size?: number;
};

function Logo({
	containerClassName,
	imgClassName,
	titleClassName,
	size,
}: LogoProps) {
	const { t } = useTranslation();
	return (
		<div className={cn("flex items-center gap-1", containerClassName)}>
			<img
				src={LogoImg}
				alt="logo"
				height={size}
				width={size}
				className={imgClassName}
			/>
			<span className={cn("font-semibold text-xl", titleClassName)}>
				{t("app_name")}
			</span>
		</div>
	);
}

export default Logo;
