import { cn } from "~/utils";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Cross1Icon, GlobeIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "~/components/auth";
import { useAuth } from "~/contexts/auth";

import type { LoggedUser } from "~/types/users";
import { useMemo } from "react";
import { generateNavRoutes } from "./helpers/generate-nav-routes";
import { useTranslation } from "~/contexts/translation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type SidebarProps = {
	opened: boolean;
	onClose: () => void;
};

export function Sidebar({ opened, onClose }: SidebarProps) {
	const { logout, user } = useAuth();
	const { t } = useTranslation();
	const navRoutes = useMemo(() => generateNavRoutes(user.role), [user.role]);

	return (
		<div
			className={cn(
				"fixed inset-y-0 w-full bg-black bg-opacity-50 z-50 transition-[inset-inline-start] duration-500",
				opened ? "start-0" : "start-[-100%]"
			)}
			onClick={onClose}
		>
			<div className="fixed inset-y-0 w-full max-w-96 bg-white z-50 shadow-lg flex flex-col">
				<div className="flex items-center justify-between p-4 border-b">
					<Logo size={50} />
					<Button size="sm" variant="ghost" onClick={onClose}>
						<Cross1Icon className="w-6 h-6" />
					</Button>
				</div>
				<nav className="flex flex-col gap-2 p-4">
					<SignedIn>
						<div className="mb-4">
							<Link
								to={"/profile/me"}
								className="py-4 gap-4 font-medium flex justify-center items-center hover:no-underline rounded-md hover:bg-muted"
							>
								<img
									src={(user as LoggedUser).img}
									alt={(user as LoggedUser).username}
									className="w-10 h-10 rounded-full"
								/>
								<span className="ml-2 text-xl">
									{(user as LoggedUser).name}
								</span>
							</Link>
						</div>
					</SignedIn>
					{navRoutes.map((route) => (
						<Button key={route.path} asChild variant="ghost">
							<Link to={route.path as any}>
								{route.Icon}
								{t(route.name)}
							</Link>
						</Button>
					))}
					<LanguageSwitcher />
				</nav>
				<div className="flex-grow" />
				<SignedOut>
					<div className="flex items-center gap-4 p-4">
						<Button variant="outline" asChild className="flex-grow">
							<Link to="/login">{t("login")}</Link>
						</Button>
						<Button asChild className="flex-grow">
							<Link to={"/register"}>{t("register")}</Link>
						</Button>
					</div>
				</SignedOut>
				<SignedIn>
					<div className="p-4">
						<Button onClick={logout} className="w-full">
							{t("logout")}
						</Button>
					</div>
				</SignedIn>
			</div>
		</div>
	);
}

function LanguageSwitcher() {
	const { t, language, languages, setLanguage } = useTranslation();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<GlobeIcon className="size-6 me-2" />
					{t("language")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={language}
					onValueChange={(l) => setLanguage(l as typeof language)}
				>
					{languages.map((lang) => (
						<DropdownMenuRadioItem key={lang} value={lang}>
							{t(lang)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
