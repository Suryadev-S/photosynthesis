'use server'

import { writeFile } from "fs/promises";
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

    await sharpInstance.toFile(outputPath);

    return { message: 'image processed', imgSrc: `http://localhost:3000/api/processed/${outputName}` };
}

export const Sender = async (formData: FormData) => {
    const imageFile = formData.get('image') as File;
    const format = imageFile.type.split('/')[1];

    if (!imageFile) return { error: 'no file uploaded' };

    // console.log(imageFile.type.split('/')[1]);

    //read the image buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    //resolve the destination path
    const outputName = `upload_${Date.now()}.${format}`;
    const outputPath = path.join(process.cwd(), 'uploads', outputName);

    //write the file to destination path
    await writeFile(outputPath, imageBuffer);

    return {
        success: 'file send successfully',
        imgSrc: `http://localhost:3000/api/uploads/${outputName}`,
        imageName: outputName
    }
}