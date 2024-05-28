import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Image
        src="/images/logo-notbg.png"
        width={200}
        height={200}
        alt="Picture of the author"
        className="w-48 h-48 md:w-52 md:h-52 lg:w-64 lg:h-64"
      />
      <h1 className="font-extrabold text-4xl md:text-6xl lg:text-8xl text-center">
        YAKINDA HİZMETİNİZDE...
      </h1>
    </div>
  );
}
