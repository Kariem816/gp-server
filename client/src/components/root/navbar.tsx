import { Link } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import Logo from "~/components/logo";
import { SignedIn, SignedOut } from "~/components/auth";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import type { LoggedUser } from "~/types/users";
import { useMemo } from "react";
import { generateNavRoutes } from "./helpers/generate-nav-routes";
import { useTranslation } from "~/contexts/translation";

export function Navbar({ toggle }: { toggle: () => void }) {
	const { user, logout } = useAuth();
	const { t } = useTranslation();

	const navRoutes = useMemo(() => generateNavRoutes(user.role), [user.role]);

	return (
		<div className="w-full mx-auto px-2">
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
					<div className="hidden xs:flex items-center gap-4">
						<Button variant="link" asChild>
							<Link to="/login">{t("login")}</Link>
						</Button>
						<Button asChild>
							<Link to="/register">{t("register")}</Link>
						</Button>
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
