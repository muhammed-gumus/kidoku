import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center mt-24">
      <Image
        src="/images/logo-notbg.png"
        width={200}
        height={200}
        alt="Picture of the author"
      />
      <h1 className="font-extrabold text-8xl mt-8">YAKINDA HİZMETİNİZDE...</h1>
    </div>
  );
}
