import { useEffect } from "react";
import { Link, Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { RouterContext } from "../routerContext";
import {
	AppShell,
	Avatar,
	Burger,
	Button,
	Group,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "~/contexts/auth";
import Logo from "~/components/logo";
import { SignedIn, SignedOut } from "~/components/auth";
import { useRouter } from "@tanstack/react-router";

import classes from "~/styles/root.module.css";

export const Route = rootRouteWithContext<RouterContext>()({
	component: RootComponent,
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
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { desktop: true, mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom="sm"
						size="sm"
					/>
					<Group justify="space-between" style={{ flex: 1 }}>
						<Logo size={50} />
						<Group ml="xl" gap="md" visibleFrom="sm">
							<UnstyledButton
								className={classes.control}
								component={Link}
								to="/"
							>
								Home
							</UnstyledButton>
							<UnstyledButton
								className={classes.control}
								component={Link}
								to="/mobile"
							>
								Our App
							</UnstyledButton>
							<SignedIn>
								<Link to="/profile/me">
									<Avatar
										// @ts-ignore
										src={user?.img}
										// @ts-ignore
										alt={user?.username}
									/>
								</Link>
								<Button
									className={classes.control}
									variant="outline"
									onClick={logout}
								>
									Logout
								</Button>
							</SignedIn>
							<SignedOut>
								<Button
									className={classes.control}
									component={Link}
									to="/login"
								>
									Login
								</Button>
							</SignedOut>
						</Group>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar py="md" px={8}>
				<Stack gap={32} mb={8} flex={1}>
					<Button component={Link} to="/mobile" variant="gradient">
						Get The App
					</Button>
					<SignedIn>
						<UnstyledButton component={Link} to="/profile/me">
							<Group>
								<Avatar
									// @ts-ignore
									src={user?.img}
									// @ts-ignore
									alt={user?.username}
								/>
								{/* @ts-ignore */}
								<Text fw={500}>{user?.username}</Text>
							</Group>
						</UnstyledButton>
					</SignedIn>
					<UnstyledButton component={Link} to="/">
						Home
					</UnstyledButton>
					<SignedOut>
						<Button
							className={classes.control}
							component={Link}
							to="/login"
						>
							Login
						</Button>
					</SignedOut>
					<SignedIn>
						<Button
							className={classes.control}
							variant="outline"
							onClick={logout}
							style={{ marginBlockStart: "auto" }}
						>
							Logout
						</Button>
					</SignedIn>
				</Stack>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
