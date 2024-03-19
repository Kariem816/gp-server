import { cn } from "~/utils";
import Logo from "../logo";
import { Button } from "../ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "../auth";
import { useAuth } from "~/contexts/auth";

type SidebarProps = {
	opened: boolean;
	onClose: () => void;
};

export function Sidebar({ opened, onClose }: SidebarProps) {
	const { logout, user } = useAuth();

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
					<Logo size={50} withImg />
					<Button size="sm" variant="ghost" onClick={onClose}>
						<Cross1Icon className="w-6 h-6" />
					</Button>
				</div>
				<nav className="flex flex-col gap-2 p-4">
					<SignedIn>
						<div className="mb-4">
							<Link
								to={"/profile/me" as any}
								className="py-4 gap-4 font-medium flex justify-center items-center hover:no-underline rounded-md hover:bg-muted"
							>
								{user.role === "guest" ? (
									<Logo size={40} withImg />
								) : (
									<>
										<img
											src={user?.img}
											alt={user?.username}
											className="w-10 h-10 rounded-full"
										/>
										<span className="ml-2 text-xl">
											{user?.name}
										</span>
									</>
								)}
							</Link>
						</div>
					</SignedIn>
					<Link className="font-medium text-lg" to="/">
						Home
					</Link>
					<Link className="font-medium text-lg" to="/monitor">
						App Monitor
					</Link>
					<Link className="font-medium text-lg" to="/mobile">
						Mobile
					</Link>
				</nav>
				<SignedOut>
					<div className="flex items-center gap-4 p-4">
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
					<div className="flex flex-grow flex-col justify-end gap-4 p-4">
						<Button
							size="sm"
							onClick={logout}
							className="rounded-xl"
						>
							Logout
						</Button>
					</div>
				</SignedIn>
			</div>
		</div>
	);
}
