import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from 'fs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;
    try {
        const filePath = path.join(process.cwd(), 'processed', filename);
        const file = await fs.promises.readFile(filePath);
        const ext = path.extname(filename).toLowerCase().slice(1);
        return new NextResponse(file, {
            status: 200,
            headers: {
                'Content-Type': `image/${ext}`, // Adjust MIME type as needed
            },
        });
    } catch (_error) {
        console.log(_error);
        return NextResponse.json("error", { status: 500 });
    }
}