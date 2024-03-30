import { useMemo } from "react";
import { useTranslation } from "~/contexts/translation";
import { Button } from "~/components/ui/button";
import {
	DoubleArrowLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

type PaginationProps = {
	page: number;
	pages: number;
	onChange: (page: number) => void;
	disabled?: boolean;
};

export function Pagination({
	page,
	pages,
	onChange,
	disabled = false,
}: PaginationProps) {
	const { isRTL } = useTranslation();

	function next() {
		const newPage = Math.min(pages, page + 1);
		onChange(newPage);
	}

	function prev() {
		const newPage = Math.max(1, page - 1);
		onChange(newPage);
	}

	function first() {
		onChange(1);
	}

	function last() {
		onChange(pages);
	}

	const firstDisabled = useMemo(
		() => page <= 1 || disabled,
		[page, disabled]
	);

	const prevDisabled = useMemo(() => page <= 1 || disabled, [page, disabled]);

	const nextDisabled = useMemo(
		() => page >= pages || disabled,
		[page, pages, disabled]
	);

	const lastDisabled = useMemo(
		() => page >= pages || disabled,
		[page, pages, disabled]
	);

	return (
		<div className="flex justify-center items-center gap-2">
			<Button
				disabled={firstDisabled}
				onClick={first}
				variant="ghost"
				size="icon"
			>
				{isRTL ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}
			</Button>
			<Button
				disabled={prevDisabled}
				onClick={prev}
				variant="ghost"
				size="icon"
			>
				{isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</Button>
			<div className="flex items-center gap-1">
				<span>{page}</span>
				<span>/</span>
				<span>{pages}</span>
			</div>
			<Button
				disabled={nextDisabled}
				onClick={next}
				variant="ghost"
				size="icon"
			>
				{isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</Button>
			<Button
				disabled={lastDisabled}
				onClick={last}
				variant="ghost"
				size="icon"
			>
				{isRTL ? <DoubleArrowLeftIcon /> : <DoubleArrowRightIcon />}
			</Button>
		</div>
	);
}
