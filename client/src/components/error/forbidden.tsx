import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { HomeIcon } from "@radix-ui/react-icons";

export default function Forbidden() {
	return (
		<>
			<h1>403</h1>
			<h2>Forbidden</h2>
			<p>You are not allowed to view this page</p>
			<Button size="lg" asChild>
				<Link to="/" className="mt-4">
					<HomeIcon className="w-6 h-6 mr-2" />
					Go home
				</Link>
			</Button>
		</>
	);
}
