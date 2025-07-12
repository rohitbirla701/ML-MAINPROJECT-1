import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography, message, Card } from "antd";

const { Title } = Typography;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: values.password,
      });
      message.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md" bordered={false}>
        <Title level={3} className="text-center">
          Reset Your Password
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: "Please enter your new password" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: "Please confirm your password" }]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
