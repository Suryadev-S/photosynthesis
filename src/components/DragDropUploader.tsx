'use client'

import { Sender } from "@/app/actions";
import { upload } from '@vercel/blob/client';
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DragDropUploader = () => {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const uploadFile = async (file: File) => {
        setUploading(true); // Show uploading indicator
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
        } finally {
            setUploading(false); // Hide uploading indicator
        }
    };

    const storeUpload = async (file: File) => {
        setUploading(true);
        try {
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/toStore',
            });
            if (blob.url) {
                router.push('/test')
            }
        } catch (error) {
            console.error(error);
            alert('error while uploading to store');
        } finally {
            setUploading(false);
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                // uploadFile(acceptedFiles[0]); 
                storeUpload(acceptedFiles[0]);
            }
        },
        accept: { "image/*": [] }, // Accept only images
        multiple: false, // Allow only one file
        disabled: uploading, // Disable dropzone while uploading
    });

    return (
        <div>

            <div {...getRootProps()} className="border-2 border-zinc-500 border-dashed p-6 rounded-lg text-center cursor-pointer text-zinc-300">
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : (
                    <p>Drag & drop an image here, or click to select</p>
                )}
            </div>
            {/* Uploading Indicator */}
            {uploading &&
                <div className="mt-4 text-center flex justify-center items-center gap-2 text-zinc-300">
                    <span className="animate-spin border-4 border-t-transparent border-white rounded-full w-6 h-6"></span>
                    <p>Uploading...</p>
                </div>
            }
        </div>
    );
};

export default DragDropUploader;