"use client";
import { useEffect, useState } from "react";
import productsData from "../../../public/db/database.json";
import Link from "next/link";
import ReactModal from "react-modal";

interface Product {
  productId: string;
  productName: string;
  productImages: string[];
  productDescription: string;
  usageInstructions: string;
  productSummary: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

const Details: React.FC<PageProps> = ({ params }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const foundProduct = productsData.products.find(
      (item) => item.productId === params.id
    );

    if (foundProduct) {
      const updatedProduct: Product = {
        ...foundProduct,
        productImages: foundProduct.productImages.map((image) =>
          image.startsWith("../public") ? image.replace("../public", "") : image
        ),
      };
      setProduct(updatedProduct);
    }
  }, [params.id]);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-24 py-16">
      <div className="flex w-full justfiy-center items-center px-24">
        <div className="w-1/2 p-6">
          {product ? (
            <div className="flex items-start justify-center flex-col gap-2">
              <h1 className="text-6xl font-extrabold">{product.productName}</h1>
              <p>{product.productSummary}</p>
              <Link href={"/"}>
                <button className="mt-4 flex items-center gap-12 px-8 py-2 text-xl rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300">
                  Buy
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
                </button>
              </Link>
            </div>
          ) : (
            <p>Ürün bulunamadı.</p>
          )}
        </div>
        <div className="w-1/2 flex items-center justify-end">
          {product && (
            <img
              className="w-3/4 h-auto rounded-full cursor-pointer"
              src={product.productImages[0]}
              alt={product.productName}
              onClick={() => openModal(product.productImages[0])}
            />
          )}
        </div>
      </div>
      {product && (
        <div className="flex flex-col text-center gap-12 mt-12 px-24">
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold">ÜRÜN HAKKINDA</p>
            <p>{product.productDescription}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold">ÜRÜN KULLANIM DETAYLARI</p>
            <p>{product.usageInstructions}</p>
          </div>
        </div>
      )}

      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Ürün Görseli"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="modal-content relative">
          <img src={selectedImage} alt="Ürün Görseli" />
          <button
            className="close-button absolute top-0 right-0 bg-gray-800 text-white px-2 py-1 m-4 rounded-full"
            onClick={closeModal}
          >
            X
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default Details;
