import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateField } from "../store/checkoutSlice";

export default function useShipping() {
  const dispatch = useAppDispatch();
  const shippingInfo = useAppSelector((state) => state.checkout);

  const handleChange = useCallback((key: string, value: string) => {
    dispatch(updateField({ key: key as any, value }));
  }, [dispatch]);

  const validate = useCallback(() => {
    return (
      shippingInfo.name.trim() !== "" &&
      shippingInfo.mobile.trim() !== "" &&
      shippingInfo.address.trim() !== ""
    );
  }, [shippingInfo]);

  return { shippingInfo, handleChange, validate };
}
