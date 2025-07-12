import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';


const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // ✅ FIX: Define formData state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FIX: Define handleChange
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <UserOutlined style={{ fontSize: 24 }} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            ML Project Monitoring
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              prefix={<MailOutlined />}
              size="large"
              value={formData.email}
              onChange={handleChange}
              required
              className="mb-4"
            />

            <label className="block mb-2 text-gray-700">Password</label>
            <Input.Password
              name="password"
              placeholder="Enter your password"
              prefix={<LockOutlined />}
              size="large"
              value={formData.password}
              onChange={handleChange}
              required
              className="mb-4"
              autoComplete="current-password"
            />
            <button>
              <Link to="/forgot-password" className='text-blue-600 hover:underline text-sm mb-4 block text-right'>
                Forgot Password?
              </Link>
            </button>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
















// import { useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

//   const LoginPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const result = await login(formData);
//     if (result.success) {
//       navigate("/dashboard");
//     } else {
//       setError(result.message || "Login failed");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           value={formData.email}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           value={formData.password}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
//         >
//           Login
//         </button>
//       </form>
//       {error && <p className="text-red-600 mt-4">{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;
