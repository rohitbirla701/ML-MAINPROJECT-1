import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FolderOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Form, Input, Button, Typography, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;


const RegisterPage = () => {
  const { user, register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    const { fullName, email, password } = data;  // exclude confirmPassword here
    await registerUser({ fullName, email, password });  // send only necessary fields
    // toast.success('Registration successful');
    navigate('/dashboard');  // redirect after successful registration
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || error.message || 'Failed to register');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-purple-600 p-3 rounded-full">
              <FolderOutlined style={{ color: 'white', fontSize: 20 }} />
            </div>
          </div>
          <Title level={3}>Create an Account</Title>
          <Text type="secondary">Sign Up to access ML Project Monitoring System</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email address' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={isSubmitting}
              icon={isSubmitting ? <LoadingOutlined /> : null}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600">
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;



















// import { useState } from "react";
// // import { useAuth } from "../../contexts/AuthContext"; // Adjust the path if needed

//   const RegisterPage = () => {
//   // const { register } = ('')

//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   password: "",
//   // });

//   // const [error, setError] = useState("");
//   // const [success, setSuccess] = useState("");

//   // const handleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setSuccess("");

//   //   const result = await register(formData);
//   //   if (result.success) {
//   //     setSuccess("Registration successful! You can now log in.");
//   //   } else {
//   //     setError(result.message || "Registration failed.");
//   //   }
//   // };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           Register
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}
//       {success && <p className="text-green-600 mt-4">{success}</p>}
//     </div>
//   );
// };

// export default RegisterPage;
