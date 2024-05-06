export function On({
	condition,
	children,
}: {
	condition: boolean;
	children: React.ReactNode;
}) {
	return condition ? children : null;
}
