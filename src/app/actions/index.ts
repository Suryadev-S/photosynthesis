'use server'

import { put } from "@vercel/blob";
import path from "path";
import sharp from "sharp";

export const Test = async (formData: FormData) => {
    console.log(formData);
}

export const Processor = async (formData: FormData) => {
    const file = formData.get("image") as File;
    const format = formData.get("format") as string;
    const quality = parseInt(formData.get("quality") as string, 10) || 100;

    if (!file) return { message: "no file passed" };

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const outputName = `processed_${Date.now()}.${format}`
    const outputPath = path.join(process.cwd(), "processed", outputName);

    let sharpInstance = sharp(fileBuffer);

    // Apply Quality Reduction
    if (format === "jpeg") sharpInstance = sharpInstance.jpeg({ quality });
    if (format === "png") sharpInstance = sharpInstance.png({ quality });
    if (format === "webp") sharpInstance = sharpInstance.webp({ quality });

    const blob = await put(`processed/${outputName}`, sharpInstance, {
        access: 'public',
    });

    return { message: 'image processed', imgSrc: blob.downloadUrl };
}

