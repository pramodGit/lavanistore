import { Levels, Rewards } from "../Mock_Data/mock_data.js";

export const userReportsController = async (req, res) => {
  console.log("req.body:", req.body);
  const { user } = req.body;

  // Proper check for empty string / missing
  if (!user || typeof user !== "string" || user.trim() === "") {
    return res.status(400).json({ error: "user is required" });
  }

  // Dummy Data
  const levels = Levels;

  // Calculate Totals
  const totals = {
    requiredTeam: levels.reduce((sum, l) => sum + l.requiredTeam, 0),
    totalTeam: levels.reduce((sum, l) => sum + l.totalTeam, 0),
    activeTeam: levels.reduce((sum, l) => sum + l.activeTeam, 0),
    income: levels.reduce((sum, l) => sum + l.income, 0),
  };

  res.json({
    user,
    levels,
    totals,
  });
};

/*
    *** User Reward 
*/
export const userRewardController = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  // Dummy Data
  const rewards = Rewards;

  res.json({
    user,
    rewards
  });
};

