"use client";
import React, { useState } from "react";
// import Map from "../../components/Map";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from 'next/dynamic';

// Map bileşenini dinamik olarak import et
const Map = dynamic(() => import("../../components/Map"), {
  ssr: false, // Sunucu tarafında render edilmesini engeller
});

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    text: "",
    timestamp: new Date().toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
    }), // Şu anki tarih ve saat değeri
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zaman damgasını güncelle
    setFormData({
      ...formData,
      timestamp: new Date().toLocaleString("tr-TR", {
        timeZone: "Europe/Istanbul",
      }),
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Mesajınız başarıyla gönderildi!");
      } else {
        throw new Error("Mesaj gönderilirken bir hata oluştu.");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center py-4 min-h-screen">
      <div className="flex md:flex-row sm:flex-col gap-4 justify-center items-center w-full md:gap-8 my-12 md:px-12 sm:px-4">
        <div className="md:w-1/2 md:mr-6 flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4 underline">
            İletişim Bilgileri
          </h2>
          <p>Adres: Ardıçlı Mah. Rauf Orbay Cad. 42250, Selçuklu/KONYA</p>
          <p>Telefon: 0(332) 205 15 00</p>
          <p>E-posta: muhendislik@ktun.edu.tr</p>

          <h2 className="text-3xl font-bold my-4 underline">İletişim Formu</h2>
          <form
            onSubmit={handleSubmit}
            className="flex justify-center w-full flex-col gap-2"
          >
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md text-black"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md text-black"
                />
              </div>
            </div>
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-2 rounded-md text-black"
            />

            <label htmlFor="text">Mesaj</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              className="w-full text-start h-20 px-2 rounded-md text-black"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Gönder
            </button>
          </form>
        </div>
        {typeof window !== 'undefined' && <Map />}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ContactPage;
