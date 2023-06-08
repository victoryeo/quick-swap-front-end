import { createAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../../store/store";
import { HYDRATE } from "next-redux-wrapper";

const hydrate = createAction<AppState>(HYDRATE);

// Type for our state
export interface UserAddress {
  userAddress: string;
  goerliPlock: boolean;
  gnosisPlock: boolean;
}

// Initial state
const initialState: UserAddress = {
  userAddress: "",
  goerliPlock: false,
  gnosisPlock: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAddress(state, action) {
      console.log('setUserAddress')
      state.userAddress = action.payload;
    },
    setGoerliPrincipalLock(state, action) {
      console.log('setGoerliPrincipalLock')
      state.goerliPlock = action.payload;
    },
    setGnosisPrincipalLock(state, action) {
      console.log('setGnosisPrincipalLock')
      state.gnosisPlock = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(hydrate, (state, action) => {
      return {
        ...state,
        ...action.payload.user
      }
    })
  }
})

export const { setUserAddress, setGoerliPrincipalLock, setGnosisPrincipalLock } = userSlice.actions
export default userSlice.reducer