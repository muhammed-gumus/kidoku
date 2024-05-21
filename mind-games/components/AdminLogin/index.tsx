"use client";
import React, { useState } from "react";

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("username", kullaniciAdi);
      formData.append("password", sifre);

      const response = await fetch("http://127.0.0.1:8000/control", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("isLoggedIn", "true");
        onLogin();
      } else {
        throw new Error("Geçersiz kullanıcı adı veya şifre");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md text-black  ">
        <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Kullanıcı Adı:
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={kullaniciAdi}
            onChange={(e) => setKullaniciAdi(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Şifre:
          </label>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded-md"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default Login;
