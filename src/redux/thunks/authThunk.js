// redux/thunks/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

import Cookies from 'js-cookie';

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("admin/login", credentials);
      const userId = response?.data?.message?.id;

      if (!userId) throw new Error("Invalid response format");

      Cookies.set("admin_id", userId, { expires: 1 / 24 }); // 1 hour
      toast.success("Login successful");

      return { userId };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  Cookies.remove('admin_id');
  toast.success("Logged out");
});
