"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MenuItemProps {
  href: string;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, text }) => {
  return (
    <li>
      <Link href={href}>
        <span className="hover:text-yellow-400 cursor-pointer">{text}</span>
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sayfa boyutunu dinleme
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        // Eğer büyük ekrana geçiş yaptıysak ve menü açıksa, menüyü kapat
        setIsMenuOpen(false);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
    // Pencere boyutu değiştiğinde handleResize işlevini çağır

    // Temizlik
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [isMenuOpen]);

  return (
    <nav className="px-24 flex justify-between items-center w-full text-black bg-white rounded-sm">
      {/* Logo */}
      <div className="text-2xl font-bold hidden md:block">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </Link>
      </div>

      {/* Burger Menü (Tablet ve Mobil Ekranlar İçin) */}
      <div className="block md:hidden flex justify-center items-center w-full">
        <div className="text-xl font-bold">
          <Link href="/">
            <Image
              src="/images/logo.png"
              width={50}
              height={50}
              alt="Picture of the author"
            />
          </Link>
        </div>
        <button onClick={toggleMenu} className="ml-auto text-4xl">
          ☰
        </button>
      </div>

      {/* Menü Öğeleri (Tablet ve Mobil Ekranlar İçin) */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 right-0 w-full h-32 bg-white flex items-center justify-center">
          <button
            onClick={toggleMenu}
            className="absolute p-4 right-0 top-0 text-black hover:text-gray-400"
          >
            x
          </button>
          <ul className="flex text-sm gap-2 items-center justift-center">
            <MenuItem href="/" text="Ana Sayfa" />
            <MenuItem href="/About" text="Hakkımızda" />
            <MenuItem href="/Games" text="Ürünlerimiz" />
            <MenuItem href="/Trainings" text="Eğitimlerimiz" />
            <MenuItem href="/Contact" text="İletişim" />
          </ul>
        </div>
      )}

      {/* Menü Öğeleri (Büyük Ekranlar İçin) */}
      <div className="hidden md:flex space-x-4 list-none items-center">
        <>
          <MenuItem href="/" text="Ana Sayfa" />
          <MenuItem href="/About" text="Hakkımızda" />
          <MenuItem href="/Games" text="Ürünlerimiz" />
          <MenuItem href="/Trainings" text="Eğitimlerimiz" />
          <MenuItem href="/Contact" text="İletişim" />
        </>
      </div>
    </nav>
  );
};

export default Navbar;
