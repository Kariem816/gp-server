export type CropData = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export async function crop(
	img: string,
	dims: { w: number; h: number },
	cropData: CropData
) {
	const imgEl = new Image();
	imgEl.src = img;
	await new Promise((resolve) => {
		imgEl.onload = resolve;
	});

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to create canvas context");

	canvas.width = dims.w;
	canvas.height = dims.h;

	const imgLoc = getImageLoc(imgEl, dims);

	ctx.drawImage(imgEl, imgLoc.x, imgLoc.y, imgLoc.w, imgLoc.h);

	const image = ctx.getImageData(
		cropData.x,
		cropData.y,
		cropData.w,
		cropData.h
	);

	canvas.width = image.width;
	canvas.height = image.height;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(image, 0, 0);

	return new Promise<string>((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) return reject("Failed to crop image");
			const url = URL.createObjectURL(blob);
			resolve(url);
		});
	});
}

export function getImageLoc(
	img: HTMLImageElement,
	dims: { w: number; h: number }
) {
	const ih = img.naturalHeight;
	const iw = img.naturalWidth;

	const imgLoc = {
		w: 0,
		h: 0,
		x: 0,
		y: 0,
	};

	const wScale = dims.w / iw;
	const hScale = dims.h / ih;

	let branch = wScale < hScale; // great variable naming skills
	if (Math.abs(wScale - hScale) < 1e-3) {
		branch = dims.w > dims.h;
	}

	if (branch) {
		imgLoc.w = dims.w;
		imgLoc.h = ih * wScale;
		imgLoc.x = 0;
		imgLoc.y = (dims.h - ih * wScale) / 2;
	} else {
		imgLoc.w = iw * hScale;
		imgLoc.h = dims.h;
		imgLoc.x = (dims.w - iw * hScale) / 2;
		imgLoc.y = 0;
	}

	return imgLoc;
}
