// src/redux/user/userThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `admin/updateUser/${userData.id}`,
        userData
      ); // adjust endpoint as needed
      return response.data.updatedUser; // assuming your backend returns the updated user as `updatedUser`
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);
