import api from "../utils/api";

// --------------------
// Types
// --------------------

// Basic user info (from registration_basic)
export interface UserBasicInfo {
  RegistrationID: number;
  FirstName: string;
  MiddleName?: string | null;
  LastName: string;
  MobileNo: string;
  EmailID: string;
  SponserShipID?: string | null;
  CreatedDate: string;
}

// Profile info (from registration_profile)
export interface UserProfileInfo {
  DOB?: string | null;
  Gender?: string | null;
  Com_City?: string | null;
  Com_State?: string | null;
  Bank_Name?: string | null;
  Bank_IFSC?: string | null;
  Bank_Account?: string | null;
  Bank_AccountType?: string | null;
}

// ✅ Team member item
export interface TeamMember {
  RegistrationID: number;
  userName: string;
  FirstName: string;
  LastName: string;
  email: string;
  mobile: string;
  registrationDate: string;
  activationDate?: string | null;
  status: string;
}
// --------------------
// Order Table Response Type
// --------------------

export interface OrderHistoryItem {
  SL_NO: number;
  ORDER_ID: number;
  USER_ID: string;
  TOTAL: number;
  ORDER_DATE: string;
  DOWNLOAD: string | null;
}

// --------------------
// API Responses
// --------------------

// ✅ Full response payload from backend
export interface UserResponse {
  user: UserBasicInfo & UserProfileInfo;
  teamMembers: TeamMember[];
}
export interface OrderHistoryResponse {
  success: boolean;
  data: OrderHistoryItem[];
}


// --------------------
// API Calls
// --------------------

// ✅ Get user details + team members
export const getUserByUsername = async (
  username: string
): Promise<UserResponse> => {
  try {
    const { data } = await api.get<UserResponse>(`/api/users/${username}`);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching user data:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch user data");
  }
};
// Get order history
export const getOrderHistory = async (
  username: string
): Promise<OrderHistoryItem[]> => {
  try {
    const { data } = await api.get<OrderHistoryResponse>(`/api/users/${username}/order-history`);
    if (!data.success) {
      throw new Error("Failed to fetch order history");
    }
    return data.data; // <-- return the array directly
  } catch (error: any) {
    console.error("❌ Failed to fetch order history:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch order history");
  }
};





