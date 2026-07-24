import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../store/cartSlice";
import "../assets/addToCart.css";

interface Product {
  id: number;          // ProdID
  title: string;       // Prod_Name
  price: number;       // SalePrice
  image: string;       // image URL from backend
  description: string; // optional/fallback if not in backend
  category: string;    // Cat_Name
}

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Extract pid from query params
  const params = new URLSearchParams(location.search);
  const pidString = params.get("pid");
  const pid = pidString ? parseInt(pidString, 10) : null;

  useEffect(() => {
    if (!pid) return;

    const fetchProduct = async (pid: number) => {
      try {
        const { data } = await api.get(`/products/${pid}`);

        // Map backend response to frontend Product interface
        const mappedProduct: Product = {
          id: data.ProdID,
          title: data.Prod_Name,
          price: data.SalePrice,
          image: data.image,                  // image URL generated in backend
          description: data.description || "",// fallback if backend does not provide
          category: data.Cat_Name,
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error("Error fetching product detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct(pid);
  }, [pid]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItem({
        id: String(product.id),
        name: product.title,
        mrp: product.price,        // ✅ backend only returns one price; using it for both
        salePrice: product.price,  // ✅ until backend also returns MRP for this endpoint
        quantity,
      })
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found!</div>;

  return (
    <>
      <Header />
      <div className="product-detail">
        <h2>{product.title}</h2>
        <div className="product-detail-content">
          <img src={product.image} alt={product.title} className="detail-image" />
          <div className="product-info">
            <p className="price">₹{product.price}</p>
            <p className="category">{product.category}</p>
            <p className="description">{product.description}</p>

            <div className="product-controls">
              <div className="qty">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="btn minus"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="qty-input"
                />
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="btn plus"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="add-btn">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;