import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const schema = yup.object().shape({
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup
		.string()
		.min(8, 'Min 8 characters')
		.matches(/[A-Z]/, 'Must contain at least one uppercase letter')
		.matches(/[0-9]/, 'Must contain at least one number')
		.matches(/[^A-Za-z0-9]/, 'Must contain at least one special character')
		.required('Password is required'),
});

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			// replace with API call
			console.log(data);
			toast.success('Logged in successfully');
		} catch (err) {
			toast.error('Login failed');
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-[#171717] text-white'>
			<Toaster />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-[#1f1f1f] p-8 rounded-xl w-full max-w-md shadow-lg space-y-6'>
				<h2 className='text-2xl font-bold text-center text-lime-400'>
					Admin Login
				</h2>

				<div>
					<label className='block mb-1 text-sm'>Email</label>
					<input
						type='email'
						{...register('email')}
						className='w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400'
					/>
					{errors.email && (
						<p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
					)}
				</div>

				<div>
					<label className='block mb-1 text-sm'>Password</label>
					<input
						type='password'
						{...register('password')}
						className='w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400'
					/>
					{errors.password && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className='w-full bg-lime-400 text-black font-semibold py-2 rounded-md hover:bg-lime-300 transition'>
					{isSubmitting ? 'Logging in...' : 'Login'}
				</button>
			</form>
		</div>
	);
};

export default Login;
