import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem } from "../../types/cart"; // adjust path if needed

const selectCartItems = (state: RootState) => state.cart.items as CartItem[];
const selectIsGreen = (state: RootState) => state.auth.user?.isGreen === 1;

export const selectCartWithPrices = createSelector(
    [selectCartItems, selectIsGreen],
    (items, isGreen): (CartItem & { finalPrice: number; subtotal: number })[] =>
        items.map((item) => {
            const finalPrice = isGreen ? item.salePrice : item.mrp;

            return {
                ...item,
                finalPrice,
                subtotal: finalPrice * item.quantity,
            };
        })
);

export const selectCartTotals = createSelector(
    [selectCartWithPrices, (state: any) => state.cart.gstRates || []],
    (items, gstRates) => {
        const totals = items.reduce(
            (acc, item) => {
                acc.totalQuantity += item.quantity;
                acc.totalPrice += item.subtotal;

                const gstPercent =
                    gstRates.find((g: any) => Number(g.ProdID) === Number(item.id))?.GST_Percent ?? 0;

                acc.totalGST += (item.subtotal * gstPercent) / 100;

                return acc;
            },
            { totalQuantity: 0, totalPrice: 0, totalGST: 0 }
        );

        return {
            ...totals,
            totalPayable: totals.totalPrice + totals.totalGST
        };
    }
);

