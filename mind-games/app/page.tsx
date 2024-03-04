import Image from "next/image";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Banner />
    </main>
  );
}
