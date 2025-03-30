'use client'

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Processor } from "../actions";

const ImageProcessor = () => {
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [croppedImage, setCroppedImage] = useState<string>("");
    const [selectedFormat, setSelectedFormat] = useState("jpeg");
    const [quality, setQuality] = useState("100");
    const [loading, setLoading] = useState(false);
    const [processedImage, setProcessedImage] = useState('');
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();

        if (croppedImage) {
            const blob = await fetch(croppedImage).then(res => res.blob());
            formData.append("image", blob, `cropped-image.${selectedFormat}`);
        } else {
            const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append("image", fileInput.files[0]);
            }
        }

        formData.append("format", selectedFormat);
        formData.append("quality", quality);

        try {

            const response = await Processor(formData);
            if (response.imgSrc) {
                setProcessedImage(response.imgSrc);
                setLoading(false);
                alert(response.message);
            } else {
                alert(response.message);
            }

        } catch (error) {
            alert("Error processing image");
        }
    };

    return (
        <div className="p-4 border rounded-lg w-96 mx-auto shadow-lg">
            <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-2">Crop & Resize Image</h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {selectedImage && (
                    <div className="mt-4">
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
                            Crop Image
                        </button>
                    </div>
                )}

                {/* Format Selection */}
                <select
                    name="format"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="mt-4 block w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                </select>

                {croppedImage &&
                    <img src={croppedImage} className="w-full rounded object-contain my-1" />}

                {/* Quality Selection */}
                <select
                    name="quality"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="mt-2 block w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="100">100% (Original)</option>
                    <option value="75">75% (Good Quality)</option>
                    <option value="50">50% (Smaller Size)</option>
                </select>

                <button type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                    Process Image
                </button>
            </form>
            {loading && <div className="bg-blue-50 text-blue-600 rounded">Preparing your image..</div>}
            {processedImage &&
                <>
                    <div>
                        <img src={processedImage} className="w-full rounded object-contain" />
                    </div>
                    <a href={processedImage} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
                        save
                    </a>
                </>
            }
        </div>
    );
};

export default ImageProcessor;