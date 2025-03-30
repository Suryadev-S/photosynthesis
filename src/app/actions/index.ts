'use server'

import path from "path";
import sharp from "sharp";

export const Processor = async (formData: FormData) => {
    const file = formData.get("image") as File;
    const format = formData.get("format") as string;
    const quality = parseInt(formData.get("quality") as string, 10) || 100;

    if (!file) return { message: "no file passed" };

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const outputName = `processed_${Date.now()}.${format}`
    const outputPath = path.join(process.cwd(), "uploads", outputName);

    let sharpInstance = sharp(fileBuffer);

    // Apply Quality Reduction
    if (format === "jpeg") sharpInstance = sharpInstance.jpeg({ quality });
    if (format === "png") sharpInstance = sharpInstance.png({ quality });
    if (format === "webp") sharpInstance = sharpInstance.webp({ quality });

    await sharpInstance.toFile(outputPath);

    return { message: 'image processed', imgSrc: `http://localhost:3000/api/uploads/${outputName}` };
}