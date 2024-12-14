export const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<File> => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		return Promise.reject("No 2d context");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (file) {
				const croppedFile = new File([file], "cropped-image.png", {
					type: "image/png",
				});
				resolve(croppedFile);
				console.log("Cropped image created successfully", croppedFile);
			} else {
				reject("Failed to crop image");
			}
		}, "image/png");
	});
};

// Helper to create image from src
const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});
