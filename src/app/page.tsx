import DragDropUploader from "@/components/DragDropUploader";

export default function Home() {
  return (
    <div className="w-full h-screen bg-zinc-900 flex flex-col justify-center items-center px-4 text-center md:bg-gradient-to-bl md:from-zinc-800 md:to-zinc-950">
      <div>
        <h1 className="text-3xl font-semibold tracking-wide bg-gradient-to-b from-white from-40% to-gray-400 bg-clip-text text-transparent md:text-4xl md:tracking-wider md:to-black">
          PhotoSynthesis
        </h1>
        <div className="mt-6 w-full max-w-xs md:max-w-md">
          <DragDropUploader />
        </div>
      </div>
    </div>

  );
}
