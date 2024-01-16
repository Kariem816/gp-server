import { Link, Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { RouterContext } from "../routerContext";
import {
	AppShell,
	Avatar,
	Burger,
	Button,
	Group,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "~/contexts/auth";
import Logo from "~/components/logo";

import classes from "~/styles/index.module.css";
import { SignedIn, SignedOut } from "~/components/auth";

export const Route = rootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const [opened, { toggle }] = useDisclosure();
	const { logout, user } = useAuth();

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

			<AppShell.Navbar py="md" px={4}>
				<UnstyledButton className={classes.control}>
					Home
				</UnstyledButton>
				<UnstyledButton className={classes.control}>
					Blog
				</UnstyledButton>
				<UnstyledButton className={classes.control}>
					Contacts
				</UnstyledButton>
				<UnstyledButton className={classes.control}>
					Support
				</UnstyledButton>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
