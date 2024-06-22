import { useEffect } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useDisclosure } from "~/hooks/use-disclosure";
import { Sidebar } from "~/components/root/sidebar";
import { NotFound } from "~/not-found";
import { Navbar } from "~/components/root/navbar";
import { Toaster } from "~/components/ui/sonner";
import { ErrorComponent } from "~/error";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
	errorComponent: ErrorComponent,
});

function RootComponent() {
	const [opened, { toggle, close }] = useDisclosure();
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = router.subscribe("onLoad", close);

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
				<Navbar toggle={toggle} />
			</header>
			<Sidebar opened={opened} onClose={close} />
			<main className="h-screen pt-14 overflow-y-auto">
				<Outlet />
			</main>
			<Toaster richColors toastOptions={{}} />
		</>
	);
}
