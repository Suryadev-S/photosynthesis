'use client'

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface ICropZone {
    imageSource: string;
    setCroppedImage: Dispatch<SetStateAction<string>>
}

const CropZone = ({ imageSource, setCroppedImage }: ICropZone) => {
    const cropperRef = useRef<ReactCropperElement>(null);
    const [imageAspectRatio, setImageAspectRatio] = useState(1);

    // Dynamically set the aspect ratio after the image loads

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedDataURL);
        }
    };

    return (
        <>
            <div className="relative">
                {/* Cropper automatically adjusts height based on width */}
                <Cropper
                    src={imageSource}
                    ref={cropperRef}
                    style={{ width: "auto", height: "400px" }}
                    // guides={false}
                    viewMode={1}
                    dragMode="move"
                    background={false}
                    autoCropArea={1}
                    checkOrientation={false}
                />
            </div>
            <div className="flex justify-between my-2">
                <Button onClick={handleCrop} className="border hover:bg-zinc-700">
                    Crop Image
                </Button>
                <Button
                    className="border hover:bg-zinc-700"
                    onClick={() => cropperRef.current?.cropper.reset()} >
                    reset
                </Button>
            </div>
        </>
    );
};

export default CropZone;