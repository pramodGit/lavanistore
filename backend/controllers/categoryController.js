import { productPool } from "../db.js";

export const getCategories = async (req, res) => {
    try {
        const [categories] = await productPool.query(
            `SELECT Cat_ID AS id, Cat_Name AS label
   FROM product_cat_master
   WHERE IsActive = ? AND Cat_Name IS NOT NULL AND Cat_Name <> ''
   ORDER BY Cat_Name ASC`,
            ["YES"] // safely inject value
        );
        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);

        // Send error details to frontend (for dev only)
        res.status(500).json({
            error: "Failed to fetch categories",
            message: err.message, // send the exact error
            stack: err.stack, // optional, useful for debugging
        });
    }
};
