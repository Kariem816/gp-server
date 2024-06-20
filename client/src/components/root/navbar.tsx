import { Link } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import Logo from "~/components/logo";
import { SignedIn, SignedOut } from "~/components/auth";
import { Button } from "~/components/ui/button";
import {
	ChevronDownIcon,
	GlobeIcon,
	HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import type { LoggedUser } from "~/types/users";
import { useMemo } from "react";
import { generateNavRoutes } from "./helpers/generate-nav-routes";
import { useTranslation } from "~/contexts/translation";
import { cn } from "~/utils";

export function Navbar({ toggle }: { toggle: () => void }) {
	const { user, logout } = useAuth();
	const { t } = useTranslation();

	const navRoutes = useMemo(() => generateNavRoutes(user.role), [user.role]);

	return (
		<div className="w-full mx-auto px-2 shadow-sm">
			<div className="flex justify-between h-14 items-center">
				<div className="flex gap-4 items-center">
					<Button
						size="icon"
						variant="ghost"
						className="sm:hidden"
						onClick={toggle}
					>
						<HamburgerMenuIcon className="w-8 h-8 " />
					</Button>
					<Link to="/" className="hover:no-underline">
						<Logo size={40} titleClassName="hidden sm:block" />
					</Link>
				</div>
				<nav className="hidden sm:flex gap-4">
					{navRoutes.map((route) => (
						<Link
							key={route.path}
							className="font-medium flex items-center text-sm transition-colors hover:underline"
							to={route.path as any}
						>
							{t(route.name)}
						</Link>
					))}
				</nav>
				<SignedOut>
					<div className="flex gap-1">
						<LanguageSwitcher />
						<div className="hidden xs:flex items-center gap-4">
							<Button variant="link" asChild>
								<Link to="/login">{t("login")}</Link>
							</Button>
							<Button asChild>
								<Link to="/register">{t("register")}</Link>
							</Button>
						</div>
					</div>
				</SignedOut>
				<SignedIn>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Avatar className="cursor-pointer">
								<AvatarImage
									src={(user as LoggedUser).img}
									alt={(user as LoggedUser).username}
								/>
								<AvatarFallback>
									{(user as LoggedUser).username?.[0] ?? "?"}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="space-y-2">
							<DropdownMenuItem asChild>
								<Link
									to={"/profile/me"}
									className="hover:no-underline cursor-pointer"
								>
									{t("profile")}
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<LanguageSwitcherInMenu />
							<DropdownMenuSeparator />
							<Button
								size="sm"
								onClick={logout}
								className="w-full"
							>
								{t("logout")}
							</Button>
						</DropdownMenuContent>
					</DropdownMenu>
				</SignedIn>
			</div>
		</div>
	);
}

function LanguageSwitcherInMenu() {
	const { t, setLanguage, language, languages } = useTranslation();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>{t("language")}</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang}
						onClick={() => setLanguage(lang)}
						className={cn(
							"hover:bg-muted text-center",
							lang === language && "text-primary"
						)}
					>
						{t(lang)}
					</DropdownMenuItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}

function LanguageSwitcher() {
	const { t, setLanguage, language, languages } = useTranslation();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<div className="flex items-center gap-1 hover:bg-muted p-2 rounded-md">
					<GlobeIcon className="size-6" />
					<ChevronDownIcon className="size-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang}
						onClick={() => setLanguage(lang)}
						className={cn(
							"hover:bg-muted text-center",
							lang === language && "text-primary"
						)}
					>
						{t(lang)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
