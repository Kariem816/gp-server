import { cn } from "~/utils";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "~/components/auth";
import { useAuth } from "~/contexts/auth";

import type { LoggedUser } from "~/types/users";
import { useMemo } from "react";
import { generateNavRoutes } from "./helpers/generate-nav-routes";
import { useTranslation } from "~/contexts/translation";

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
				"fixed inset-y-0 w-full bg-black bg-opacity-50 z-50 transition-[left] duration-500",
				opened ? "left-0" : "left-[-100%]"
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
						<Link
							key={route.path}
							className="font-medium text-lg"
							to={route.path as any}
						>
							{t(route.name)}
						</Link>
					))}
				</nav>
				<SignedOut>
					<div className="flex items-center gap-4 p-4">
						<Link to="/login">
							<Button size="sm" variant="outline">
								{t("login")}
							</Button>
						</Link>
						<Link to={"/register" as any}>
							<Button size="sm">{t("register")}</Button>
						</Link>
					</div>
				</SignedOut>
				<SignedIn>
					<div className="flex flex-grow flex-col justify-end gap-4 p-4">
						<Button
							size="sm"
							onClick={logout}
							className="rounded-xl"
						>
							{t("logout")}
						</Button>
					</div>
				</SignedIn>
			</div>
		</div>
	);
}
