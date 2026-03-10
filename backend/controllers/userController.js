import { pool, productPool } from "../db.js";
import {
  GET_USER_LOGIN_BY_USERNAME,
  GET_USER_REGISTRATION_BY_ID,
  GET_TEAM_MEMBERS_BY_SPONSOR, 
} from "../queries/userQueries.js";

/**
 * Get user details and their team members (downline)
 */
export const getTeamByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Step 1: Get login details
    const [loginRows] = await pool.query(GET_USER_LOGIN_BY_USERNAME, [username]);
    if (!loginRows.length) {
      return res.status(404).json({ error: "User login not found" });
    }

    // Step 2: Get registration details
    const { RegistrationID } = loginRows[0];
    const [regRows] = await pool.query(GET_USER_REGISTRATION_BY_ID, [RegistrationID]);
    if (!regRows.length) {
      return res.status(404).json({ error: "User registration not found" });
    }

    const user = regRows[0];

    // Step 3: Get team members (could include multi-level downline)
    const [teamMembers] = await pool.query(GET_TEAM_MEMBERS_BY_SPONSOR, [username]);

    // Step 4: Return structured response
    return res.status(200).json({
      user,
      teamMembers,
    });
  } catch (err) {
    console.error("❌ Error fetching team by username:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { username } = req.params; // <- get username from URL

    const [rows] = await productPool.query(
      `SELECT 
          ROW_NUMBER() OVER (ORDER BY SaleCusID) AS SL_NO,
          SaleID AS ORDER_ID,
          UserName AS USER_ID,
          TotalPayable AS TOTAL,
          DATE(Tran_Date) AS ORDER_DATE,
          Sale_PDF AS DOWNLOAD
       FROM product_sale_to_customerdetails
       WHERE UserName = ?`,   // <-- filter by username
      [username]               // <-- parameter binding for security
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("❌ Error fetching order history:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



