import { useEffect } from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import Logo from "~/components/logo";
import { SignedIn, SignedOut } from "~/components/auth";
import { useRouter } from "@tanstack/react-router";
import { useDisclosure } from "~/hooks/use-disclosure";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "~/components/root/sidebar";
import { NotFound } from "~/not-found";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import type { LoggedUser } from "~/types/users";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	const [opened, { toggle, close }] = useDisclosure();
	const { logout, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = router.subscribe("onLoad", close);

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
				<div className="w-full max-w-7xl mx-auto px-4">
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
								<Logo
									size={40}
									titleClassName="hidden sm:block"
								/>
							</Link>
						</div>
						<nav className="hidden sm:flex gap-4">
							<Link
								className="font-medium flex items-center text-sm transition-colors hover:underline"
								to="/"
							>
								Home
							</Link>
							<Link
								className="font-medium flex items-center text-sm transition-colors hover:underline"
								to="/monitor"
							>
								App Monitor
							</Link>
							<Link
								className="font-medium flex items-center text-sm transition-colors hover:underline"
								to="/mobile"
							>
								Mobile
							</Link>
						</nav>
						<SignedOut>
							<div className="flex items-center gap-4">
								<Link to="/login">
									<Button size="sm" variant="outline">
										Sign in
									</Button>
								</Link>
								<Link to={"/register" as any}>
									<Button size="sm">Sign up</Button>
								</Link>
							</div>
						</SignedOut>
						<SignedIn>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Avatar className="cursor-pointer">
										<AvatarImage
											src={(user as LoggedUser).img}
											alt={(user as LoggedUser).username}
										/>
										<AvatarFallback>
											{(user as LoggedUser).username[0]}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="space-y-2"
								>
									<DropdownMenuItem asChild>
										<Link
											to={"/profile/me" as any}
											className="hover:no-underline cursor-pointer"
										>
											Profile
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<Button
										size="sm"
										onClick={logout}
										className="w-full"
									>
										Logout
									</Button>
								</DropdownMenuContent>
							</DropdownMenu>
							{/* <div className="flex items-center gap-4">
								<Link to={"/profile/me" as any}>
									<Button size="sm" variant="ghost">
										{user.role === "guest" ? (
											<Logo size={40} />
										) : (
											<img
												src={user?.img}
												alt={user?.username}
												className="w-8 h-8 rounded-full"
											/>
										)}
									</Button>
								</Link>
								<Button size="sm" onClick={logout}>
									Logout
								</Button>
							</div> */}
						</SignedIn>
					</div>
				</div>
			</nav>
			<Sidebar opened={opened} onClose={close} />
			<main className="h-screen pt-14">
				<Outlet />
			</main>
		</>
	);
}
