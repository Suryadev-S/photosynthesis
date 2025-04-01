import DragDropUploader from "@/components/DragDropUploader";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen bg-linear-to-bl from-zinc-800 to-zinc-950 flex justify-center items-center">
      <div>
        <h1 className="text-4xl tracking-wider bg-linear-to-b from-white from-40% bg-clip-text text-transparent to-black">PhotoSynthesis</h1>
        <DragDropUploader />
      </div>
    </div>
  );
}
