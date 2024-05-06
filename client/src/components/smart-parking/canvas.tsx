import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { CheckIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useTranslation } from "~/contexts/translation";
import { toast } from "sonner";
import { saveParkingSpots } from "~/services/smart-parking";

type Point = [number, number];
type Polygon = Point[];
export type ParkingSpot = {
	location: string;
	poly: Polygon;
};

type SelectorCanvasProps = {
	bg: string;
	initialSpots: ParkingSpot[];
};

const POLY_COLOR = "#2563eb";
const CURRENT_COLOR = "#ef4444";

function drawPoint(ctx: CanvasRenderingContext2D, point: Point, color: string) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLine(
	ctx: CanvasRenderingContext2D,
	a: Point,
	b: Point,
	color: string
) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(a[0], a[1]);
	ctx.lineTo(b[0], b[1]);
	ctx.stroke();
}

function checkInside(poly: Polygon, x: number, y: number) {
	let segments = 0;
	const len = poly.length;
	for (let i = 0; i < len; i++) {
		const [x1, y1] = poly[i];
		const [x2, y2] = poly[(i + 1) % len];

		if ((y1 > y && y2 > y) || (y1 < y && y2 < y)) {
			//
		} else if (x1 < x && x2 < x) {
			//
		} else {
			const slope = (y1 - y2) / (x1 - x2);
			const interceptX = -((y1 - y) / slope) + x1;
			if (interceptX > x) segments++;
		}
	}

	return segments % 2 === 1;
}

// TODO: refactor this code
export function SelectorCanvas({ bg, initialSpots }: SelectorCanvasProps) {
	const [spots, setSpots] = useState<ParkingSpot[]>(initialSpots);
	const [polygons, setPolygons] = useState<Polygon[]>(
		initialSpots.map((s) => s.poly)
	);
	const [currentPoly, setCurrentPoly] = useState<Point[]>([]);

	// TODO: refactor the useEffect especially
	useEffect(() => {
		setSpots(initialSpots);
		setPolygons(initialSpots.map((s) => s.poly));
	}, [initialSpots]);

	const { t } = useTranslation();
	const [saving, setSaving] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	const scalingX = useRef(1);
	const scalingY = useRef(1);

	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const draw = () => {
			const { width, height } =
				containerRef.current!.getBoundingClientRect();
			scalingX.current = width / canvas.width;
			scalingY.current = height / canvas.height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (imgRef.current) {
				ctx.drawImage(
					imgRef.current,
					0,
					0,
					canvas.width,
					canvas.height
				);
			}

			for (let i = 0; i < polygons.length; i++) {
				const poly = polygons[i];
				for (let j = 0; j < poly.length; j++) {
					drawLine(
						ctx,
						poly[j],
						poly[(j + 1) % poly.length],
						POLY_COLOR
					);
					drawPoint(ctx, poly[j], POLY_COLOR);
				}
			}

			for (let i = 0; i < currentPoly.length; i++) {
				drawPoint(ctx, currentPoly[i], CURRENT_COLOR);
				if (i > 0) {
					drawLine(
						ctx,
						currentPoly[i - 1],
						currentPoly[i],
						CURRENT_COLOR
					);
				}
			}

			requestAnimationFrame(draw);
		};

		draw();
	}, [canvasRef, polygons, currentPoly, bg]);

	function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / scalingX.current;
		const y = (e.clientY - rect.top) / scalingY.current;

		const button = e.button;
		const clicked = currentPoly.find(([px, py]) => {
			return Math.abs(px - x) < 20 && Math.abs(py - y) < 20;
		});

		if (button === 0 && !clicked) {
			setCurrentPoly((prev) => [...prev, [x, y]]);
		} else if (button === 0) {
			setCurrentPoly([]);
			const location = prompt(t("enter_spot_name"));
			if (location) {
				setSpots([
					...spots,
					{
						location,
						poly: currentPoly,
					},
				]);
				setPolygons((prev) => [...prev, currentPoly]);
			}
		} else if (button === 1) {
			e.preventDefault();
			if (currentPoly.length > 0) {
				setCurrentPoly((prev) => prev.slice(0, -1));
			} else {
				const insidePolyIdx = polygons.findIndex((poly) =>
					checkInside(poly, x, y)
				);
				if (insidePolyIdx === -1) return;
				const location = prompt(t("change_spot_name"));
				if (location) {
					setSpots((prev) =>
						prev.map((p, i) =>
							i === insidePolyIdx ? { ...p, location } : p
						)
					);
				}
			}
		} else if (button === 2) {
			if (currentPoly.length > 0) setCurrentPoly([]);
			else {
				const insidePolyIdx = polygons.findIndex((poly) =>
					checkInside(poly, x, y)
				);
				if (insidePolyIdx === -1) return;
				setPolygons((prev) =>
					prev.filter((_p, i) => i !== insidePolyIdx)
				);
				setSpots((prev) => prev.filter((_p, i) => i !== insidePolyIdx));
			}
		}
	}

	function handleClear() {
		setPolygons([]);
		setCurrentPoly([]);
		setSpots([]);
	}

	async function handleSave() {
		setSaving(true);
		try {
			const resp = await saveParkingSpots(spots);
			toast.success(resp.data.message);
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="space-y-4">
			<img src={bg} ref={imgRef} className="hidden" />
			<div className="mx-auto max-w-7xl" ref={containerRef}>
				<canvas
					className="w-full border-2"
					ref={canvasRef}
					height={900}
					width={1600}
					onMouseDown={handleMouseDown}
					onContextMenu={(e) => e.preventDefault()}
				/>
			</div>
			<div className="flex justify-end gap-2">
				<Button onClick={handleClear} variant="destructive" size="icon">
					<TrashIcon />
				</Button>
				<Button
					onClick={handleSave}
					size="icon"
					variant="success"
					disabled={saving}
				>
					{saving ? (
						<UpdateIcon className="animate-spin" />
					) : (
						<CheckIcon />
					)}
				</Button>
			</div>
		</div>
	);
}
