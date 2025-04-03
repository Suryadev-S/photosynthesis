'use client'

import CropZone from "@/components/CropZone";
import { use, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Processor } from "@/app/actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
    format: z.enum(['jpeg', 'png', 'webp']),
    quality: z.number().min(10).max(100)
});

const Page = ({ params }: { params: Promise<{ image: string }> }) => {
    const { image } = use(params);
    const [croppedImage, setCroppedImage] = useState('');
    const [processedImage, setProcessedImage] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            format: 'jpeg',
            quality: 100,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const croppedImageBlob = await fetch(croppedImage).then((res) => res.blob());
            const formData = new FormData();
            formData.append('image', croppedImageBlob);
            formData.append('format', values.format);
            formData.append('quality', values.quality.toString());

            // await Test(formData);
            const response = await Processor(formData);
            if (response.imgSrc) {
                // alert(response.message);
                toast(response.message);
                setProcessedImage(response.imgSrc);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="grid md:grid-cols-2 bg-linear-to-bl from-zinc-800 to-zinc-950 text-white min-h-screen">
            <section className="w-4/5 mx-auto">
                <h1 className="text-2xl my-4 md:text-3xl">CropZone</h1>
                <CropZone
                    imageSource={`http://localhost:3000/api/uploads/${image}`}
                    setCroppedImage={setCroppedImage}
                />

                {/* {shadcn form here} */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        {/* Format Selection */}
                        <FormField
                            control={form.control}
                            name="format"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Format</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="jpeg">JPEG</SelectItem>
                                            <SelectItem value="png">PNG</SelectItem>
                                            <SelectItem value="webp">WebP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Quality Slider */}
                        <FormField
                            control={form.control}
                            name="quality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quality {field.value}</FormLabel>
                                    <FormControl>
                                        <Slider
                                            className="[&_[data-slot=slider-range]]:bg-zinc-600"
                                            min={10}
                                            max={100}
                                            step={1}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type="submit" disabled={loading} className="border hover:bg-zinc-700">
                            {loading ? 'Processing...' : 'Apply Changes'}
                        </Button>
                    </form>
                </Form>
            </section>
            <section>
                {croppedImage &&
                    <div className="h-[400px] overflow-hidden mt-17">
                        <img src={croppedImage} className="h-full object-contain mx-auto" alt="image"/>
                    </div>
                }
                {processedImage &&
                    <Button variant={'link'} asChild className="text-white border">
                        <Link href={processedImage}>save image</Link>
                    </Button>}
            </section>
        </div>
    );
};

export default Page;