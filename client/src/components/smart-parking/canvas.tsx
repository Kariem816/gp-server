import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { CheckIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useTranslation } from "~/contexts/translation";
import { toast } from "sonner";
import { saveParkingSpots } from "~/services/parking";

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
const RADIUS = 5;
const THICKNESS = 2;

function drawPoint(
	ctx: CanvasRenderingContext2D,
	point: Point,
	color: string,
	r: number
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(point[0], point[1], r, 0, 2 * Math.PI);
	ctx.fill();
}

function drawLine(
	ctx: CanvasRenderingContext2D,
	a: Point,
	b: Point,
	color: string,
	thickness: number
) {
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
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

export function SelectorCanvas({ bg, initialSpots }: SelectorCanvasProps) {
	const spots = useRef<ParkingSpot[]>(initialSpots).current;
	const polygons = useRef<Polygon[]>(initialSpots.map((s) => s.poly)).current;
	const currentPoly = useRef<Point[]>([]).current;

	const mouseInside = useRef(true);
	const mouse = useRef<Point>([0, 0]).current;
	const mouseHolding = useRef<[number, number]>([-1, -1]);

	useEffect(() => {
		spots.length = initialSpots.length;
		for (let i = 0; i < initialSpots.length; i++) {
			spots[i] = initialSpots[i];
		}

		polygons.length = initialSpots.length;
		for (let i = 0; i < initialSpots.length; i++) {
			polygons[i] = initialSpots[i].poly;
		}
	}, [initialSpots]);

	const { t } = useTranslation();
	const [saving, setSaving] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	const scalingX = useRef(1);
	const scalingY = useRef(1);
	const scalingR = useRef(1);

	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let frameHandle: number;

		const draw = () => {
			const { width, height } =
				containerRef.current!.getBoundingClientRect();
			scalingX.current = width / canvas.width;
			scalingY.current = height / canvas.height;
			scalingR.current = Math.max(scalingX.current, scalingY.current);

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

			for (let i = 0; i < spots.length; i++) {
				const { poly } = spots[i];
				for (let j = 0; j < poly.length; j++) {
					drawLine(
						ctx,
						poly[j],
						poly[(j + 1) % poly.length],
						POLY_COLOR,
						THICKNESS / scalingR.current
					);
					drawPoint(
						ctx,
						poly[j],
						POLY_COLOR,
						RADIUS / scalingR.current
					);
				}
			}

			for (const spot of spots) {
				const { poly, location } = spot;
				if (checkInside(poly, mouse[0], mouse[1])) {
					const midX =
						poly.reduce((acc, [x]) => acc + x, 0) / poly.length;
					const midY =
						poly.reduce((acc, [, y]) => acc + y, 0) / poly.length;

					const { width: tw } = ctx.measureText(location);
					ctx.fillStyle = POLY_COLOR;
					ctx.fillRect(midX - 10 - tw / 2, midY - 30, 20 + tw, 40);
					ctx.font = "20px sans-serif";
					ctx.fillStyle = "white";
					ctx.fillText(location, midX - tw / 2, midY);
					break;
				}
			}

			for (let i = 0; i < currentPoly.length; i++) {
				drawPoint(
					ctx,
					currentPoly[i],
					CURRENT_COLOR,
					RADIUS / scalingR.current
				);
				if (i > 0) {
					drawLine(
						ctx,
						currentPoly[i - 1],
						currentPoly[i],
						CURRENT_COLOR,
						THICKNESS / scalingR.current
					);
				}
			}

			if (currentPoly.length > 0) {
				if (
					Math.hypot(
						mouse[0] - currentPoly[0][0],
						mouse[1] - currentPoly[0][1]
					) >
					(RADIUS * 2) / scalingR.current
				) {
					drawPoint(
						ctx,
						mouse,
						CURRENT_COLOR,
						RADIUS / scalingR.current
					);
					drawLine(
						ctx,
						currentPoly[currentPoly.length - 1],
						mouse,
						CURRENT_COLOR,
						THICKNESS / scalingR.current
					);
				} else {
					drawLine(
						ctx,
						currentPoly[currentPoly.length - 1],
						currentPoly[0],
						CURRENT_COLOR,
						THICKNESS / scalingR.current
					);
				}
			}

			frameHandle = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			if (frameHandle) cancelAnimationFrame(frameHandle);
		};
	}, [canvasRef, containerRef, bg]);

	function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = Math.round((e.clientX - rect.left) / scalingX.current);
		const y = Math.round((e.clientY - rect.top) / scalingY.current);

		const button = e.button;
		const clicked = currentPoly.find(([px, py]) => {
			return (
				Math.abs(px - x) < (RADIUS * 2) / scalingR.current &&
				Math.abs(py - y) < (RADIUS * 2) / scalingR.current
			);
		});

		if (button === 0 && !clicked) {
			currentPoly.push([x, y]);
		} else if (button === 0) {
			if (
				currentPoly[0][0] === clicked![0] &&
				currentPoly[0][1] === clicked![1]
			) {
				const location = prompt(t("enter_spot_name"));
				if (location) {
					spots.push({
						location,
						poly: [...currentPoly],
					});
					polygons.push([...currentPoly]);
				}
				currentPoly.length = 0;
			}
		} else if (button === 1) {
			e.preventDefault();
			if (currentPoly.length > 0) {
				currentPoly.length = currentPoly.length - 1;
			} else {
				for (let i = 0; i < polygons.length; i++) {
					for (let j = 0; j < polygons[i].length; j++) {
						const [px, py] = polygons[i][j];
						if (
							Math.abs(px - x) <
								(RADIUS * 2) / scalingR.current &&
							Math.abs(py - y) < (RADIUS * 2) / scalingR.current
						) {
							mouseHolding.current = [i, j];
							return;
						}
					}
				}
				const insidePolyIdx = polygons.findIndex((poly) =>
					checkInside(poly, x, y)
				);
				if (insidePolyIdx === -1) return;
				const location = prompt(t("change_spot_name"));
				if (location) {
					spots[insidePolyIdx].location = location;
				}
			}
		} else if (button === 2) {
			if (currentPoly.length > 0) currentPoly.length = 0;
			else {
				const insidePolyIdx = polygons.findIndex((poly) =>
					checkInside(poly, x, y)
				);
				if (insidePolyIdx === -1) return;
				polygons.splice(insidePolyIdx, 1);
				spots.splice(insidePolyIdx, 1);
			}
		}
	}

	function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = Math.round((e.clientX - rect.left) / scalingX.current);
		const y = Math.round((e.clientY - rect.top) / scalingY.current);

		if (mouseInside.current) {
			mouse[0] = x;
			mouse[1] = y;
			if (mouseHolding.current[0] !== -1) {
				const [i, j] = mouseHolding.current;
				polygons[i][j] = [x, y];
				spots[i].poly[j] = polygons[i][j];
			}
		}
	}

	function handleMouseUp() {
		if (mouseHolding.current[0] !== -1) {
			mouseHolding.current = [-1, -1];
		}
	}

	function handleClear() {
		spots.length = 0;
		polygons.length = 0;
		currentPoly.length = 0;
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
					onMouseUp={handleMouseUp}
					onMouseEnter={() => (mouseInside.current = true)}
					onMouseLeave={() => (mouseInside.current = false)}
					onMouseMove={handleMouseMove}
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
