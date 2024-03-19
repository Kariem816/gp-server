import { useCallback, useState } from "react";

export function useDisclosure() {
	const [opened, setOpened] = useState(false);
	const toggle = useCallback(() => setOpened((prev) => !prev), []);
	const open = useCallback(() => setOpened(true), []);
	const close = useCallback(() => setOpened(false), []);

	return [opened, { toggle, open, close }] as const;
}
