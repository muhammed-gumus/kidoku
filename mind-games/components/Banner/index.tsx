import React from "react";
import Link from "next/link";

const titleText1 = "Kidoku"; // Kullanmak istediğiniz özel metin
const titleText2 = "Akademi";
const descText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
const customImageUrl = "images/banner.jpg"; // Kullanmak istediğiniz özel görsel URL

const Banner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 md:flex-row md:justify-around md:px-20">
      {/* Metin ve Butonlar */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2">
        <div className="mb-6">
          <p className="md:text-6xl font-bold sm:text-4xl">{titleText1}</p>
          <p className="md:text-8xl font-extrabold tracking-wider sm:text-6xl">{titleText2}</p>
        </div>

        <p className="md:text-xl sm:px-2 md:px-0 opacity-70 mb-6 md:pr-16">{descText}</p>

        <Link href={"/Games"}>
          <button className="flex flex-row items-center gap-4 text-black px-10 py-3 rounded-lg text-xl bg-white transition duration-300 hover:text-indigo-600 hover:bg-white mb-6 md:mb-0">
            Product
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </Link>
      </div>

      {/* Özel Görsel (Tablet ve Büyük Ekranlarda) */}
      <div className=" md:block flex items-center justify-center md:w-1/3 sm:w-2/7">
        <img
          src={customImageUrl}
          alt="Banner"
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
