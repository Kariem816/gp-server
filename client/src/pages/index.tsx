import { FileRoute } from "@tanstack/react-router";
import { AppShell, Burger, Group, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "~/components/logo";

import classes from "~/styles/index.module.css";

export const Route = new FileRoute("/").createRoute({
	component: Page,
});

export function Page() {
	const [opened, { toggle }] = useDisclosure();

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
						<Logo size={30} />
						<Group ml="xl" gap={0} visibleFrom="sm">
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
				Navbar is only visible on mobile, links that are rendered in the
				header on desktop are hidden on mobile in header and rendered in
				navbar instead.
			</AppShell.Main>
		</AppShell>
	);
}
