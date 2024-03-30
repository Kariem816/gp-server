import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { HomeIcon } from "@radix-ui/react-icons";

export default function NotFound() {
	return (
		<>
			<h1>404</h1>
			<h2>Page not found</h2>
			<p>The page you are looking for does not exist.</p>
			<Button size="lg" asChild>
				<Link to="/" className="mt-4">
					<HomeIcon className="w-6 h-6 mr-2" />
					Go home
				</Link>
			</Button>
		</>
	);
}
