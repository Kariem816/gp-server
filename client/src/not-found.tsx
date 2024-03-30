import NotFoundComponent from "./components/error/not-found";

export function NotFound() {
	return (
		<div className="h-full flex flex-col items-center justify-center text-center">
			<NotFoundComponent />
		</div>
	);
}
