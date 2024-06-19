import { useEffect, useRef } from "react";

import type { CropData } from "~/utils/images";

type CropperProps = {
	img: string;
	onChange: (croppedImg: CropData) => void;
	disabled?: boolean;
};

const CROPPER_SIZE = 100;
const width = 1600;
const height = 900;

function euclideanDistance(p1: [number, number], p2: [number, number]) {
	const [x1, y1] = p1;
	const [x2, y2] = p2;
	return Math.hypot(x2 - x1, y2 - y1);
}

export function Cropper({ img, onChange, disabled = false }: CropperProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	const scalingX = useRef(1);
	const scalingY = useRef(1);

	const zoom = useRef(1);
	const mousePos = useRef({ x: 0, y: 0 });
	const cropper = useRef({
		x: (width - CROPPER_SIZE) / 2,
		y: (height - CROPPER_SIZE) / 2,
	}).current;
	const imgLoc = useRef({
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		ex: 0,
		ey: 0,
	}).current;
	const isDragging = useRef(false);
	const touchDist = useRef(0);

	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
					imgLoc.x,
					imgLoc.y,
					imgLoc.w,
					imgLoc.h
				);
			}

			// mask
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.beginPath();
			ctx.rect(
				cropper.x,
				cropper.y,
				CROPPER_SIZE * zoom.current,
				CROPPER_SIZE * zoom.current
			);
			ctx.rect(canvas.width, 0, -canvas.width, canvas.height);
			ctx.fill();

			// border
			ctx.strokeStyle = "white";
			ctx.lineWidth = 5;
			ctx.strokeRect(
				cropper.x,
				cropper.y,
				CROPPER_SIZE * zoom.current,
				CROPPER_SIZE * zoom.current
			);

			// crosshair
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(
				cropper.x,
				cropper.y + (CROPPER_SIZE * zoom.current) / 2
			);
			ctx.lineTo(
				cropper.x + CROPPER_SIZE * zoom.current,
				cropper.y + (CROPPER_SIZE * zoom.current) / 2
			);
			ctx.moveTo(
				cropper.x + (CROPPER_SIZE * zoom.current) / 2,
				cropper.y
			);
			ctx.lineTo(
				cropper.x + (CROPPER_SIZE * zoom.current) / 2,
				cropper.y + CROPPER_SIZE * zoom.current
			);
			ctx.stroke();

			requestAnimationFrame(draw);
		};

		draw();
	}, [canvasRef]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		});

		canvas.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});

		canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

		canvas.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			canvas.removeEventListener("touchstart", handleTouchStart);
			canvas.removeEventListener("touchmove", handleTouchMove);
			canvas.removeEventListener("touchend", handleTouchEnd);
			canvas.removeEventListener("wheel", handleWheel);
		};
	}, [canvasRef]);

	function handleImageLoad() {
		const ih = imgRef.current!.naturalHeight;
		const iw = imgRef.current!.naturalWidth;

		const wScale = width / iw;
		const hScale = height / ih;

		let branch = wScale < hScale; // great variable naming skills
		if (Math.abs(wScale - hScale) < 1e-3) {
			branch = width > height;
		}

		if (branch) {
			imgLoc.w = width;
			imgLoc.h = ih * wScale;
			imgLoc.x = 0;
			imgLoc.y = (height - ih * wScale) / 2;
			imgLoc.ex = width;
			imgLoc.ey = imgLoc.y + ih * wScale;

			zoom.current = imgLoc.h / CROPPER_SIZE;
			cropper.x = (width - imgLoc.h) / 2;
			cropper.y = (height - CROPPER_SIZE * zoom.current) / 2;
		} else {
			imgLoc.w = iw * hScale;
			imgLoc.h = height;
			imgLoc.x = (width - iw * hScale) / 2;
			imgLoc.y = 0;
			imgLoc.ex = imgLoc.x + iw * hScale;
			imgLoc.ey = height;

			zoom.current = imgLoc.w / CROPPER_SIZE;
			cropper.x = (width - CROPPER_SIZE * zoom.current) / 2;
			cropper.y = (height - imgLoc.w) / 2;
		}
		onChange({
			x: cropper.x,
			y: cropper.y,
			w: CROPPER_SIZE * zoom.current,
			h: CROPPER_SIZE * zoom.current,
		});
	}

	function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
		if (disabled) return;
		const rect = e.currentTarget.getBoundingClientRect();
		mousePos.current.x = (e.clientX - rect.left) / scalingX.current;
		mousePos.current.y = (e.clientY - rect.top) / scalingY.current;
		if (isDragging.current) {
			const newX = mousePos.current.x - (CROPPER_SIZE / 2) * zoom.current;
			const newY = mousePos.current.y - (CROPPER_SIZE / 2) * zoom.current;
			cropper.x =
				newX < imgLoc.x
					? imgLoc.x
					: newX > imgLoc.ex - CROPPER_SIZE * zoom.current
						? imgLoc.ex - CROPPER_SIZE * zoom.current
						: newX;

			cropper.y =
				newY < imgLoc.y
					? imgLoc.y
					: newY > imgLoc.ey - CROPPER_SIZE * zoom.current
						? imgLoc.ey - CROPPER_SIZE * zoom.current
						: newY;
			onChange({
				x: cropper.x,
				y: cropper.y,
				w: CROPPER_SIZE * zoom.current,
				h: CROPPER_SIZE * zoom.current,
			});
		}
	}

	function handleMouseDown() {
		if (disabled) return;
		isDragging.current = true;
	}

	function handleMouseUp() {
		if (disabled) return;
		isDragging.current = false;
	}

	function handleWheel(e: WheelEvent) {
		if (disabled) return;
		e.preventDefault();

		const { deltaY } = e;
		const newZoom = zoom.current + deltaY * -0.001;

		if (newZoom < 0.1) {
			zoom.current = 0.1;
			onChange({
				x: cropper.x,
				y: cropper.y,
				w: CROPPER_SIZE * zoom.current,
				h: CROPPER_SIZE * zoom.current,
			});
			return;
		}

		let xZoom = newZoom;
		let yZoom = newZoom;

		if (deltaY < 0) {
			const oldSize = CROPPER_SIZE * zoom.current;
			const newSize = CROPPER_SIZE * newZoom;

			if (newSize > imgLoc.w || newSize > imgLoc.h) {
				if (oldSize < imgLoc.w && oldSize < imgLoc.h) {
					zoom.current = Math.min(
						imgLoc.w / CROPPER_SIZE,
						imgLoc.h / CROPPER_SIZE
					);
					cropper.x = imgLoc.x;
					cropper.y = imgLoc.y;
				}
				onChange({
					x: cropper.x,
					y: cropper.y,
					w: CROPPER_SIZE * zoom.current,
					h: CROPPER_SIZE * zoom.current,
				});
				return;
			}

			// check x bounds
			if (cropper.x + newSize > imgLoc.ex) {
				// new zoom pushes through the right edge
				if (cropper.x + oldSize < imgLoc.ex) {
					// but we still have some space
					// so we zoom in to the right edge exactly
					xZoom = (imgLoc.ex - cropper.x) / CROPPER_SIZE;
				} else if (cropper.x > imgLoc.x) {
					// we don't have space to the right, check if we have space to the left
					// yes we do, so we zoom in to the left edge
					if (newSize < imgLoc.w) {
						// we have space to the left
						cropper.x = imgLoc.ex - newSize;
					} else {
						// if we zoom in more, we will push through the left edge
						// so we zoom in to the left edge exactly
						xZoom = imgLoc.w / CROPPER_SIZE;
						cropper.x = imgLoc.x;
					}
				} else {
					// we don't have space to the left either
					// we can't zoom in anymore
				}
			}

			// check y bounds
			if (cropper.y + newSize > imgLoc.y + imgLoc.h) {
				// new zoom pushes through the bottom edge
				if (cropper.y + oldSize < imgLoc.ey) {
					// but we still have some space
					// so we zoom in to the bottom edge exactly
					yZoom = (imgLoc.ey - cropper.y) / CROPPER_SIZE;
				} else if (cropper.y > imgLoc.y) {
					// we don't have space to the bottom, check if we have space to the top
					// yes we do, so we zoom in to the top edge
					if (newSize < imgLoc.h) {
						// we have space to the top
						cropper.y = imgLoc.ey - newSize;
					} else {
						// if we zoom in more, we will push through the top edge
						// so we zoom in to the top edge exactly
						yZoom = imgLoc.h / CROPPER_SIZE;
						cropper.y = imgLoc.y;
					}
				} else {
					// we don't have space to the top either
					// we can't zoom in anymore
				}
			}
		}

		zoom.current = Math.min(xZoom, yZoom);
		onChange({
			x: cropper.x,
			y: cropper.y,
			w: CROPPER_SIZE * zoom.current,
			h: CROPPER_SIZE * zoom.current,
		});
	}

	function handleTouchStart(e: TouchEvent) {
		if (disabled) return;
		if (e.touches.length === 2) {
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			touchDist.current = euclideanDistance(
				[t1.clientX, t1.clientY],
				[t2.clientX, t2.clientY]
			);
		} else {
			handleMouseDown();
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (disabled) return;
		e.preventDefault();
		if (e.touches.length === 2) {
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			const newDist = euclideanDistance(
				[t1.clientX, t1.clientY],
				[t2.clientX, t2.clientY]
			);
			const deltaY = (touchDist.current - newDist) * 20; // arbitrary multiplier
			touchDist.current = newDist;
			handleWheel({ deltaY } as WheelEvent);
		} else if (e.touches.length === 1) {
			const rect = containerRef.current!.getBoundingClientRect();
			const t = e.touches[0];
			mousePos.current.x = (t.clientX - rect.left) / scalingX.current;
			mousePos.current.y = (t.clientY - rect.top) / scalingY.current;
			if (isDragging.current) {
				const newX =
					mousePos.current.x - (CROPPER_SIZE / 2) * zoom.current;
				const newY =
					mousePos.current.y - (CROPPER_SIZE / 2) * zoom.current;

				cropper.x =
					newX < imgLoc.x
						? imgLoc.x
						: newX > imgLoc.ex - CROPPER_SIZE * zoom.current
							? imgLoc.ex - CROPPER_SIZE * zoom.current
							: newX;

				cropper.y =
					newY < imgLoc.y
						? imgLoc.y
						: newY > imgLoc.ey - CROPPER_SIZE * zoom.current
							? imgLoc.ey - CROPPER_SIZE * zoom.current
							: newY;

				onChange({
					x: cropper.x,
					y: cropper.y,
					w: CROPPER_SIZE * zoom.current,
					h: CROPPER_SIZE * zoom.current,
				});
			}
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (disabled) return;
		if (e.touches.length === 0) handleMouseUp();
	}

	return (
		<div className="space-y-4">
			<img
				src={img}
				ref={imgRef}
				style={{ display: "none" }}
				onLoad={handleImageLoad}
			/>
			<div className="mx-auto max-w-full" ref={containerRef}>
				<canvas
					ref={canvasRef}
					className="w-full border-2"
					height={900}
					width={1600}
					onMouseMove={handleMouseMove}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onContextMenu={(e) => e.preventDefault()}
				/>
			</div>
		</div>
	);
}
