"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productImages: string[];
  selectedCategory: string;
}

const Games = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productsGet");
        const data = await response.json();

        const receivedProducts = data.products || data;

        if (Array.isArray(receivedProducts)) {
          const transformedProducts = receivedProducts.map(
            (product: Product) => ({
              ...product,
              productImages: product.productImages.map((image: string) =>
                image.replace("../public", "")
              ),
            })
          );

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts); // Tüm ürünleri başlangıçta filtrele
        } else {
          console.error("Ürünler bir dizi içermiyor:", receivedProducts);
        }
      } catch (error) {
        console.error("Ürünleri getirirken hata oluştu:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/categories");
        const data = await response.json();

        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error("Kategoriler bir dizi içermiyor:", data);
        }
      } catch (error) {
        console.error("Kategorileri getirirken hata oluştu:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filterProductsByCategory = (category: string | null) => {
    setSelectedCategory(category);

    if (category === null) {
      // Seçilen kategori yoksa, tüm ürünleri göster
      setFilteredProducts(products);
    } else {
      // Seçilen kategoriye göre ürünleri filtrele
      const filtered = products.filter(
        (product) => product.selectedCategory === category
      );
      setFilteredProducts(filtered);
    }
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex min-h-screen flex-col items-center w-full">
      <h1 className="font-extrabold text-6xl mt-8">Ürünlerimiz</h1>
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={() => filterProductsByCategory(null)} className={selectedCategory === null ? 'underline' : ''}>Tümü</button>
        {categories.map((category) => (
          <button key={category} onClick={() => filterProductsByCategory(category)} className={selectedCategory === category ? 'underline' : ''}>
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-8 px-24 mt-8 mb-16">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="flex rounded-md bg-white flex-col items-center"
          >
            {product.productImages.length > 0 && (
              <img
                className="w-full rounded-t-md"
                style={{ height: "250px", width: "100%" }}
                src={product.productImages[0]}
                alt={`Ürün Resmi ${index}`}
              />
            )}
            <div className="flex flex-col items-center gap-2 mb-4 text-center mt-2">
              <h3 className="text-black font-bold text-2xl line-clamp-1">
                {product.productName}
              </h3>
              <p className="text-gray-600 line-clamp-3 px-4">
                {truncateDescription(product.productDescription, 150)}
              </p>
            </div>
            <div className="flex mt-auto w-full">
              <Link href="#" className="w-full">
                <button className="bg-green-600 text-white px-6 py-4 w-full">
                  Satın Al
                </button>
              </Link>
              <Link
                href={`/PlaceDetails/${product.productId}`}
                className="w-full"
              >
                <button className="bg-blue-500 text-white px-6 py-4 w-full">
                  Detay
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
