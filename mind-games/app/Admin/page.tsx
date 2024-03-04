"use client";
import React, { useState, useEffect, useRef } from "react";
import Login from "@/components/AdminLogin";

interface Product {
  productId: string;
  productName: string;
  // Diğer ürün alanları
}

interface Message {
  text: string;
  email: string;
  timestamp: string;
  // Diğer özellikler
}

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("addProduct"); // Varsayılan olarak "Ürün Ekle" tab'ini seçili yap
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/messages");
        if (response.ok) {
          const responseData = await response.json();
          setMessages(responseData.messages);
        } else {
          console.error("Mesajları getirirken hata oluştu");
        }
      } catch (error) {
        console.error("Mesajları getirirken hata oluştu:", error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productsGet");

        if (response.ok) {
          const responseData = await response.json();
          setProducts(responseData.products);
        } else {
          console.error("Ürünleri getirirken hata oluştu");
        }
      } catch (error) {
        console.error("Ürünleri getirirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, [currentTab]); // currentTab değiştiğinde yeniden çağır

  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [productDescription, setProductDescription] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [productSummary, setProductSummary] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 5) {
        alert("En fazla 5 resim yükleyebilirsiniz.");
        return;
      }
      setProductImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Form verilerini hazırla
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("usageInstructions", usageInstructions);
      formData.append("productSummary", productSummary);
      formData.append("selectedCategory", selectedCategory);

      if (productImages) {
        for (let i = 0; i < productImages.length; i++) {
          formData.append("productImages", productImages[i]);
        }
      }

      // Ürün ekleme isteğini gönder
      const response = await fetch("http://127.0.0.1:8000/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Ürün başarıyla eklendi:", responseData);

        // Add the new product to the state with the generated productId
        setProducts((prevProducts) => [
          ...prevProducts,
          { productId: responseData.productId, productName /* other fields */ },
        ]);

        // Sayfayı yenile
        window.location.reload();
      } else {
        // Hata durumunda
        const errorData = await response.json();
        console.error("Ürün eklenirken hata oluştu:", errorData.detail);
      }
    } catch (error) {
      // Beklenmeyen hataları yakala
      console.error("Ürün eklenirken hata oluştu:", error);
    }
  };

  const handleClearForm: React.MouseEventHandler<HTMLButtonElement> = () => {
    setProductName("");
    setProductImages(null);
    setProductDescription("");
    setUsageInstructions("");
    setSelectedCategory("");
    setProductSummary("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setClearForm(false);
  };

  useEffect(() => {
    if (clearForm) {
      setProductName("");
      setProductImages(null);
      setProductDescription("");
      setUsageInstructions("");
      setSelectedCategory("");
      setClearForm(false);
    }
  }, [clearForm]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    try {
      for (const productId of selectedProducts) {
        const response = await fetch(
          `http://127.0.0.1:8000/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("Ürün başarıyla silindi:", responseData);
        } else {
          const errorData = await response.json();
          console.error("Ürün silinirken hata oluştu:", errorData.detail);
        }
      }

      // Seçili ürünleri listeden kaldır
      const updatedProducts = products.filter(
        (product) => !selectedProducts.includes(product.productId)
      );
      setProducts(updatedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md text-black">
        <h1 className="flex items-center justify-center text-4xl font-extrabold underline mb-4">
          Yönetici Paneli
        </h1>
        <ul className="flex mb-4 justify-center items-center italic">
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "addProduct" ? "font-bold" : ""
            }`}
            onClick={() => setCurrentTab("addProduct")}
          >
            Ürün Ekle
          </li>
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "removeProduct" ? "font-bold" : ""
            }`}
            onClick={() => setCurrentTab("removeProduct")}
          >
            Ürün Çıkar
          </li>
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "messages" ? "font-bold" : ""
            }`}
            onClick={() => setCurrentTab("messages")}
          >
            Mesajlar
          </li>
        </ul>
        {currentTab === "addProduct" && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Adı:
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Kategorisi:
              </label>
              <select
                className="mt-1 p-2 w-full border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Kategori Seçiniz</option>
                <option value="kategori1">Kategori 1</option>
                <option value="kategori2">Kategori 2</option>
                <option value="kategori3">Kategori 3</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Resimleri (en fazla 5):
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                ref={imageInputRef}
              />
              {productImages && (
                <div className="mt-2">
                  <p>Seçilen dosyalar:</p>
                  <ul>
                    {Array.from(productImages).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Özet Bilgi:
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={productSummary}
                onChange={(e) => setProductSummary(e.target.value)}
                maxLength={100} // Maksimum 200 karakter sınırı
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Açıklaması:
              </label>
              <textarea
                className="mt-1 p-2 w-full border rounded-md"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Kullanım Talimatları:
              </label>
              <textarea
                className="mt-1 p-2 w-full border rounded-md"
                value={usageInstructions}
                onChange={(e) => setUsageInstructions(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Ürün Ekle
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-200 "
              >
                Formu Temizle
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded-md  hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              >
                Çıkış Yap
              </button>
            </div>
          </form>
        )}
        {currentTab === "removeProduct" && (
          <div className="flex flex-col items-start mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white p-4 rounded-md shadow-md flex flex-col items-center justify-center"
                  style={{ minHeight: "80px" }} // Çerçeve boyutunu sabitleme
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.productId)}
                    onChange={() => toggleProductSelection(product.productId)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <div className="overflow-hidden max-w-full text-center">
                    <span className="line-clamp-2">{product.productName}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleDeleteSelectedProducts}
                disabled={selectedProducts.length === 0}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
                  selectedProducts.length === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                }`}
              >
                Seçili Ürünleri Sil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        )}

        {currentTab === "messages" && (
          <div>
            {/* Mesajlar */}
            <ul className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex flex-row gap-4 items-end">
                    <p className="font-bold">{message.email}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    <p>{message.timestamp}</p>
                  </div>
                  <p>{message.text}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
