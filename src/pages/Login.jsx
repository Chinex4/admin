import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/thunks/authThunk";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/dashboard/users");
    }
  };

  return (
    <div className='auth-shell'>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='auth-card space-y-6'
      >
        <h2 className='text-2xl font-bold text-center text-lime-300'>
          Admin Login
        </h2>

        <div>
          <label className='block mb-1 text-sm'>Email</label>
          <input
            type='email'
            {...register("email")}
            className='input-dark'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 text-sm'>Password</label>
          <input
            type='password'
            {...register("password")}
            className='input-dark'
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='button-primary w-full'
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

