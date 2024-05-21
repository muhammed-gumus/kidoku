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
  firstName: string;
  lastName: string;
  // Diğer özellikler
}

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("addProduct"); // Varsayılan olarak "Ürün Ekle" tab'ini seçili yap
  const [messages, setMessages] = useState<Message[]>([]);
  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [productDescription, setProductDescription] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [productSummary, setProductSummary] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]); // Kategorileri tutmak için state eklendi
  const [newCategoryInput, setNewCategoryInput] = useState(""); // Yeni kategori input değeri için state eklendi
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Kategoriler alınırken bir hata oluştu.");
        }
      } catch (error) {
        console.error("Kategoriler alınırken bir hata oluştu:", error);
      }
    };
    fetchCategories();
  }, []);

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

  const handleAddCategory = async () => {
    if (newCategoryInput.trim() !== "") {
      try {
        const response = await fetch("http://127.0.0.1:8000/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategoryInput.trim() }),
        });

        if (response.ok) {
          setCategories((prevCategories) => [
            ...prevCategories,
            newCategoryInput.trim(),
          ]);
          setNewCategoryInput(""); // input alanını temizle
          console.log("Kategori başarıyla eklendi.");
        } else {
          console.error("Kategori eklenirken bir hata oluştu.");
        }
      } catch (error) {
        console.error("Kategori eklenirken bir hata oluştu:", error);
      }
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categories/${category}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Kategori başarıyla silindi:", responseData);
        // Kategori silindikten sonra frontend'de de kategoriyi güncelle
        setCategories(categories.filter((cat) => cat !== category));
      } else {
        const errorData = await response.json();
        console.error("Kategori silinirken hata oluştu:", errorData.detail);
      }
    } catch (error) {
      console.error("Kategori silinirken hata oluştu:", error);
    }
  };

  const checkSessionTimeout = () => {
    const currentTime = Date.now();
    const lastInteraction = lastInteractionTime;
    const timeoutDuration = 5 * 60 * 1000; // 5 dakika

    if (currentTime - lastInteraction > timeoutDuration) {
      handleLogout();
    }
  };

  useEffect(() => {
    const interval = setInterval(checkSessionTimeout, 60000); // Her dakika kontrol
    return () => clearInterval(interval);
  }, [lastInteractionTime]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
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
            onClick={() => handleTabChange("addProduct")}
          >
            Ürün Ekle
          </li>
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "removeProduct" ? "font-bold" : ""
            }`}
            onClick={() => handleTabChange("removeProduct")}
          >
            Ürün Çıkar
          </li>
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "messages" ? "font-bold" : ""
            }`}
            onClick={() => handleTabChange("messages")}
          >
            Mesajlar
          </li>
          <li
            className={`mr-4 cursor-pointer ${
              currentTab === "addCategory" ? "font-bold" : ""
            }`}
            onClick={() => handleTabChange("addCategory")}
          >
            Kategori Ekle
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
                {categories &&
                  categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ürün Özeti:
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={productSummary}
                onChange={(e) => setProductSummary(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ürünü Ekle
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Formu Temizle
            </button>
          </form>
        )}
        {currentTab === "removeProduct" && (
          <div>
            <h2 className="text-lg font-medium mb-2">
              Silmek istediğiniz ürünleri seçin:
            </h2>
            {products.map((product) => (
              <div key={product.productId} className="mb-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.productId)}
                  onChange={() =>
                    toggleProductSelection(product.productId)
                  }
                  className="mr-2"
                />
                <span>{product.productName}</span>
              </div>
            ))}
            <button
              onClick={handleDeleteSelectedProducts}
              disabled={selectedProducts.length === 0}
              className={`px-4 py-2 mt-4 bg-red-500 text-white rounded-md ${
                selectedProducts.length === 0 && "opacity-50 cursor-not-allowed"
              }`}
            >
              Seçilenleri Sil
            </button>
          </div>
        )}
        {currentTab === "messages" && (
          <div>
            <h2 className="text-lg font-medium mb-2">Gelen Mesajlar:</h2>
            {messages.map((message) => (
              <div
                key={message.timestamp}
                className="border-b py-2 flex flex-col"
              >
                <p className="mb-1">
                  <span className="font-bold">İsim:</span>{" "}
                  {message.firstName} {message.lastName}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Email:</span> {message.email}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Mesaj:</span> {message.text}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Tarih:</span>{" "}
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
        {currentTab === "addCategory" && (
          <div>
            <h2 className="text-lg font-medium mb-2">Kategoriler:</h2>
            <ul className="mb-4">
              {categories.map((category) => (
                <li key={category} className="flex items-center">
                  <span className="mr-2">{category}</span>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-500"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Yeni Kategori Ekle:
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 mt-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Ekle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
