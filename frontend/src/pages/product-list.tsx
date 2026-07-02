import React, { useEffect, useState, useMemo } from "react";
import "../assets/product-listing.css";
import Footer from "../layout/footer";
import Header from "../layout/header";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AddToCartButton } from "../components/AddToCart";
import withErrorBoundary from "../shared/errorBoundaryHOC";


// UPDATE: Change categoryId type to number temporarily to match API, 
// OR keep it string and ensure ALL normalization is robust. We will keep it string
// and ensure robust normalization.
interface Product {
  id: number;
  title: string;
  price: number;
  mrp: number;
  description: string;
  category: string;
  categoryId: string; // Keep as string for filtering consistency
  image: string;
  rating: { rate: number; count: number };
  stockStatus: string;
  unit: string;
  discount: number;
}

interface Category {
  id: string;    // Keep as string for filtering consistency
  label: string;
}

interface ProductListingProps {
  limit?: { start: number; end: number };
}

const ProductListing: React.FC<ProductListingProps> = ({
  limit = { start: 0, end: 200 },
}) => {
  const { start, end } = limit;
  const navigate = useNavigate();
  
  // FIX 1: Use a dedicated state for the FULL product list
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        // FIX 2: Explicitly ensure ALL category IDs are STRINGS
        const categoriesData = catRes.data.map((c: any) => ({
          id: String(c.id), // Guaranteed string ID, e.g., "15"
          label: c.label,
        }));

        // FIX 3: Explicitly ensure ALL product category IDs are STRINGS
        const normalizedProducts = prodRes.data.map((p: any) => ({
          ...p,
          // Use p.categoryId which exists and is a number in the API, 
          // and convert it to a string for filtering
          categoryId: String(p.categoryId ?? "0"), 
        }));
        
        setAllProducts(normalizedProducts); // Store the full list
        setCategories(categoriesData);
        
      } catch (err) {
        console.error("Error fetching products or categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  // FIX 4: Filter and Limit logic runs on every state change
  const { categoryFilteredProducts, displayedProducts } = useMemo(() => {
    
    // Step A: Apply category filtering to the *complete* list (allProducts)
    const filtered =
      selectedCategories.length > 0
        ? allProducts.filter((p) => selectedCategories.includes(p.categoryId))
        : allProducts;

    // Step B: Apply the optional limit to the filtered list for display
    const limited = filtered.slice(start, end);
    
    return { 
        categoryFilteredProducts: filtered, 
        displayedProducts: limited 
    };
  }, [allProducts, selectedCategories, start, end]);
    
  if (loading) return <div className="shimmer">Loading...</div>;

  return (
    <>
      <Header />
      <section className="main">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside id="sideBar" className="sidebar">
            <nav className="side-filter-nav">
              <ul>
                <li className="title">
                  <h2>Categories</h2>
                </li>

                {categories.map((cat, idx) => (
                  <li className="field" key={cat.id}>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        id={`category_${cat.id}`}
                        // IDs are strings, which is correct
                        checked={selectedCategories.includes(String(cat.id))}
                        onChange={() => toggleCategory(String(cat.id))}
                        tabIndex={idx}
                      />
                      <label htmlFor={`category_${cat.id}`}>{cat.label}</label>
                    </div>
                  </li>
                ))}

                <li className="text">
                  {/* Shows the count of products matching the filter *before* limiting */}
                  See <span>{categoryFilteredProducts.length}</span> Results
                </li>

                <li className="text">
                  <button onClick={clearFilters} className="med-btn">
                    Clear All
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {/* Product listing */}
        <main className="products">
          <h2>
            {/* Shows the count of products matching the filter *before* limiting */}
            Products Count: <span id="productCount">{categoryFilteredProducts.length}</span>
          </h2>

          <div id="productList" className="product-grid">
            {/* Renders the limited and filtered list */}
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="item"
                // onClick={() => navigate(`/product-detail?pid=${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <figure>
                  <img
                    className="image"
                    src={product.image}
                    alt={product.title}
                  />
                  <figcaption className="title" title={product.title}>
                    {product.title}
                  </figcaption>
                </figure>

                <div className="price">Sale Price: ₹{product.price.toFixed(2)}</div>
                <div className="price">MRP: ₹{product.mrp.toFixed(2)}</div>

                <div onClick={(e) => e.stopPropagation()}>
                  <AddToCartButton
                    product={{
                      id: String(product.id),
                      name: product.title,
                      price: product.price,
                      mrp: product.mrp
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
};

// export default ProductListing;
// export default withErrorBoundary(ProductListing);
export default withErrorBoundary(ProductListing, <div>Something went wrong.</div>);