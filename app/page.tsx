import { GoogleMap } from "@/components/GoogleMap";
import Google from "next-auth/providers/google";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <GoogleMap />
      </div>
    </main>
  );
}
