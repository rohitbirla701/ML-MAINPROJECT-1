import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card, Row, Col } from "antd";
import axios from "../../api/axios";

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", {
        email: values.email,
      });

      if (res.data.success) {
        message.success("Password reset link sent to your email.");
      } else {
        message.error(res.data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      message.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "24px" }}>
      <Col xs={24} sm={20} md={16} lg={10} xl={8}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>Forgot Password</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input placeholder="Enter your registered email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
