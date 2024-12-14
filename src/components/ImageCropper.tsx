import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { getCroppedImg } from "./cropImage";

interface ImageCropperProps {
	imageUrl: string;
	cropComplete: (croppedImageFile: File) => void;
	onCancel?: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
	imageUrl,
	cropComplete,
	onCancel,
}) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const handleCrop = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
			cropComplete(croppedImage); // Call cropComplete with the cropped image file
		} catch (e) {
			console.error(e);
		}
	}, [imageUrl, croppedAreaPixels, cropComplete]);

	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131010]/70 p-4">
			<div className="bg-[#F0BB78] rounded-lg p-6 w-full max-w-md shadow-lg">
				<div className="relative aspect-square w-full mb-4">
					<Cropper
						image={imageUrl}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
						classes={{
							containerClassName: "rounded-lg overflow-hidden",
							cropAreaClassName: "border-2 border-[#543A14]",
						}}
					/>
				</div>

				<div className="mb-4">
					<label className="block text-[#543A14] text-sm font-bold mb-2">
						Zoom
					</label>
					<Slider
						value={[zoom * 100]}
						onValueChange={(value) => setZoom(value[0] / 100)}
						min={100}
						max={300}
						step={10}
						className="w-full"
					/>
				</div>

				<div className="flex justify-between space-x-4">
					<Button
						variant="outline"
						onClick={onCancel}
						className="flex-1 bg-[#FFF0DC] text-[#543A14] border-[#543A14] hover:bg-[#543A14]/10"
					>
						Cancel
					</Button>
					<Button
						onClick={handleCrop}
						className="flex-1 bg-[#543A14] text-[#F0BB78] hover:bg-[#543A14]/90"
					>
						Crop
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ImageCropper;
