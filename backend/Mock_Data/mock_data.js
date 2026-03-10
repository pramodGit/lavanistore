/**
 * @typedef {"Activated" | "Pending"} LevelStatus
 */

/**
 * @typedef {Object} Level
 * @property {string} level        // e.g. "Level 1"
 * @property {number} requiredTeam
 * @property {number} totalTeam
 * @property {number} activeTeam
 * @property {number} income
 * @property {LevelStatus} status
 */

/** @type {Level[]} */
export const Levels = [
  {
    level: "Level 1",
    requiredTeam: 3,
    totalTeam: 3,
    activeTeam: 3,
    income: 100,
    status: "Activated",
  },
  {
    level: "Level 2",
    requiredTeam: 2,
    totalTeam: 1,
    activeTeam: 1,
    income: 350,
    status: "Pending",
  },
  {
    level: "Level 3",
    requiredTeam: 21,
    totalTeam: 0,
    activeTeam: 0,
    income: 450,
    status: "Pending",
  },
];


  /**
 * @typedef {"Activated" | "Expired" | "Pending"} RewardStatus
 */

/**
 * @typedef {Object} Reward
 * @property {number} level
 * @property {number} requiredDirect
 * @property {number} requiredTeam
 * @property {number} yourDirectTeam
 * @property {number} yourActiveTeam
 * @property {number} remainingTeam
 * @property {string} timeLimit      // e.g. "10 Days"
 * @property {string} remainingTime  // e.g. "2 Days"
 * @property {string} reward         // e.g. "Samsung Tablet"
 * @property {number} income
 * @property {string} achievedDate   // "" or "2025-08-23"
 * @property {RewardStatus} status
 */

/** @type {Reward[]} */
export const Rewards = [
  {
    level: 1,
    requiredDirect: 2,
    requiredTeam: 3,
    yourDirectTeam: 3,
    yourActiveTeam: 3,
    remainingTeam: 32,
    timeLimit: "10 Days",
    remainingTime: "0 Days",
    reward: "Redme Phone",
    income: 32000,
    achievedDate: "",
    status: "Activated",
  },
  {
    level: 2,
    requiredDirect: 2,
    requiredTeam: 32,
    yourDirectTeam: 3,
    yourActiveTeam: 0,
    remainingTeam: 32,
    timeLimit: "10 Days",
    remainingTime: "0 Days",
    reward: "Samsung Tablet",
    income: 160000,
    achievedDate: "",
    status: "Expired",
  },
  {
    level: 3,
    requiredDirect: 2,
    requiredTeam: 64,
    yourDirectTeam: 3,
    yourActiveTeam: 0,
    remainingTeam: 64,
    timeLimit: "12 Days",
    remainingTime: "2 Days",
    reward: "Platina Bike",
    income: 320000,
    achievedDate: "",
    status: "Pending",
  },
];