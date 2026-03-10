import { productPool } from "../db.js";
import { BASE_PRODUCT_QUERY } from "../queries/productOrderQueries.js";

// Helper: sanitize folder names
const sanitizeFolderName = (name, defaultName = "DEFAULT BRAND") =>
  (name || defaultName)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");

// Helper: slugify product name for filename
const slugifyProductName = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "_")
    .replace(/^_|_$/g, "");

export const getProductsController = async (req, res) => {
  try {
    const { category } = req.query;
    const params = ["YES"];

    let query = `${BASE_PRODUCT_QUERY} WHERE p.IsActive = ?`;

    if (category) {
      query += " AND c.Cat_Name = ?";
      params.push(category);
    }

    query += " ORDER BY p.ProdID ASC";

    const [products] = await productPool.query(query, params);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    const baseCdnUrl = process.env.CDN_IMG_URL || "";

    const response = products.map((prod) => {
      const categoryFolder = sanitizeFolderName(prod.Cat_Name, "general");
      const brandFolder = sanitizeFolderName(prod.Brand_Name, "DEFAULT BRAND");
      const imageFileName = `${slugifyProductName(prod.Prod_Img)}`;

      const imageUrl = `${baseCdnUrl}/${categoryFolder}/${brandFolder}/${imageFileName}`;

      return {
        id: prod.ProdID,
        title: prod.Prod_Name,
        price: prod.SalePrice ?? prod.Rate ?? 0,
        mrp: prod.Product_MRP ?? 0,
        description: `Description of ${prod.Prod_Name}`,
        categoryId: prod.Cat_ID,
        category: prod.Cat_Name || "General",
        image: imageUrl,
        rating: {
          rate: +(Math.random() * 2 + 3).toFixed(1),
          count: Math.floor(Math.random() * 100 + 1),
        },
        stockStatus: prod.IsOutOfStock === "YES" ? "Out of Stock" : "In Stock",
        unit: prod.Unit || "",
        discount: prod.Discount ?? 0,
        brandName: prod.Brand_Name || "DEFAULT BRAND",
      };
    });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      error: "Failed to fetch products",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// Single product by ID
export const getProductByIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid) return res.status(400).json({ message: "Product ID is required" });

    // Fetch all product details and images for this product
    const [rows] = await productPool.query(PRODUCT_DETAILS_PAGE_QUERY, ["YES", pid]);

    if (!rows.length) return res.status(404).json({ message: "Product not found" });

    const prod = rows[0];

    // Folders for CDN URL
    const categoryFolder = sanitizeFolderName(prod.Cat_Name, "general");
    const brandFolder = sanitizeFolderName(prod.Brand_Name, "DEFAULT BRAND");

    // Map all images with slugified filenames and CDN URLs
    const images = rows.map(row => {
      const fileName = row.product_image_path || row.product_image || "default.png";
      const imageFileName = slugifyProductName(fileName);

      return {
        Prod_DTL_ID: row.Prod_DTL_ID,
        Prod_Details: row.Prod_Details,
        ArrivalDate: row.ArrivalDate,
        imageUrl: `${process.env.CDN_IMG_URL}/${categoryFolder}/${brandFolder}/${imageFileName}`
      };
    });

    // Return product info with images array
    res.json({
      ProdID: prod.ProdID,
      Prod_Name: prod.Prod_Name,
      SalePrice: prod.SalePrice,
      Rate: prod.Rate,
      Unit: prod.Unit,
      Discount: prod.Discount,
      IsOutOfStock: prod.IsOutOfStock,
      Cat_Name: prod.Cat_Name,
      Brand_Name: prod.Brand_Name,
      images
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ----------------------
// Get GST rates for multiple products
// ----------------------
export const getGSTRatesController = async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: "productIds array is required" });
  }

  const connection = await productPool.getConnection();

  try {
    const placeholders = productIds.map(() => "?").join(", ");
    const [rows] = await connection.query(
      `SELECT Prod_ID AS ProdID, GST_Percent
       FROM prod_gst_master
       WHERE Prod_ID IN (${placeholders}) AND IsActive='YES'`,
      productIds
    );

    connection.release();
    return res.json(rows);
  } catch (err) {
    connection.release();
    console.error("Error fetching GST rates:", err);
    return res.status(500).json({ error: "Failed to fetch GST rates" });
  }
};
