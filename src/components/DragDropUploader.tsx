'use client'

import { Sender } from "@/app/actions";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

const DragDropUploader = () => {
    const router = useRouter();
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await Sender(formData);

            if (response.success) {
                router.push(`/photo/${response.imageName}`)
            } else {
                throw new Error(response.error);
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file.");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                uploadFile(acceptedFiles[0]); // Upload the first file
            }
        },
        accept: { "image/*": [] }, // Accept only images
        multiple: false, // Allow only one file
    });

    return (
        <div {...getRootProps()} className="border-2 border-zinc-500 border-dashed p-6 rounded-lg text-center cursor-pointer text-zinc-300">
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here...</p>
            ) : (
                <p>Drag & drop an image here, or click to select</p>
            )}
        </div>
    );
};

export default DragDropUploader;