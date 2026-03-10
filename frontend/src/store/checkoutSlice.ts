import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShippingState {
  name: string;
  mobile: string;
  address: string;
}

const initialState: ShippingState = {
  name: "",
  mobile: "",
  address: "",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ key: keyof ShippingState; value: string }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    resetShipping: () => initialState,
  },
});

export const { updateField, resetShipping } = checkoutSlice.actions;
export default checkoutSlice.reducer;
