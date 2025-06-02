// redux/thunks/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("admin/login", credentials);
      const userId = response?.data?.message?.id;

      if (!userId) throw new Error("Invalid response format");

      localStorage.setItem("admin_id", userId);  
      toast.success("Login successful");

      return { userId };  
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  toast.success("Logged out");
});
