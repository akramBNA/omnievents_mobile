import * as authService from "@/services/auth.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      const user = await authService.login(email, password);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (
    { firstName, lastName, email, password }: any,
    { rejectWithValue },
  ) => {
    try {
      const user = await authService.signup(
        firstName,
        lastName,
        email,
        password,
      );
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
