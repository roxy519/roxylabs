import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#pwd262424] font-mono text-white">
  <main className="min-h-screen flex items-center justify-center">
  <div className="flex items-center gap-8">
    <Image
      src="/roxylabs-mark-gradient.svg"
      alt="Roxy Labs"
      width={120}
      height={120}
    />

    <div>
      <h1 className="text-5xl font-bold">roxy labs</h1>

      <p className="mt-4 text-xl text-neutral-400 max-w-xl">
        experiments in ai, automation, marketing,
        operations, and creative projects.
      </p>
    </div>
  </div>
</main>
    </div>
  );
}
