'use client'

import { useState, useRef, ChangeEvent } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = () => {
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [croppedImage, setCroppedImage] = useState<string>("");
    const cropperRef = useRef<ReactCropperElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedDataURL); // Save cropped image preview
        }
    };

    return (
        <div className="p-4 border rounded-lg w-96 mx-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Crop Your Image</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {selectedImage && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Adjust the crop area:</p>
                    <Cropper
                        src={selectedImage}
                        style={{ height: 300, width: "100%" }}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                        viewMode={1}
                        dragMode="move"
                    />
                    <button
                        type="button"
                        onClick={handleCrop}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
                    >
                        Save Cropped Image
                    </button>
                </div>
            )}

            {croppedImage && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Cropped Image:</h3>
                    <img src={croppedImage} alt="Cropped" className="mt-2 rounded-lg shadow-md w-full" />
                    <a
                        href={croppedImage}
                        download="cropped-image.png"
                        className="mt-2 block text-center text-blue-600 hover:underline"
                    >
                        Download Cropped Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default ImageCropper;