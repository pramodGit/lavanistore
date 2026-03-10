// src/store/selectors/authSelectors.ts
import { RootState } from "../store";

export const selectIsGreenUser = (state: RootState) => {
  const val = state.auth.user?.isGreen;
  return Number(val) === 1;
};
