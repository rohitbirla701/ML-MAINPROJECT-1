import React from 'react';
import { Form, Input, Select, DatePicker, Button, message, Row, Col } from 'antd';
import dayjs from 'dayjs';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateProjectPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const payload = {
      ...values,
      dateReceived: dayjs(values.dateReceived).format('YYYY-MM-DD'),
      dateDelivered: dayjs(values.dateDelivered).format('YYYY-MM-DD'),
    };

    try {
      const res = await api.post('/projects', payload);
      message.success(res.data.message || 'Project created!');
      form.resetFields();
      navigate('/projects/new');
    } catch (err) {
      console.error('Error creating project:', err);
      message.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const validateDeliveryDate = (_, value) => {
    const receivedDate = form.getFieldValue('dateReceived');
    if (receivedDate && value && value.isBefore(receivedDate)) {
      return Promise.reject(new Error('Delivery date must be after received date'));
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 800, width: '100%' }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Project Name"
              name="projectName"
              rules={[{ required: true, message: 'Please enter project name' }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Project Type"
              name="projectType"
              rules={[{ required: true, message: 'Please select project type' }]}
            >
              <Select placeholder="Select project type">
                <Option value="Mockups">Mockups</Option>
                <Option value="Proposals">Proposals</Option>
                <Option value="Presentations">Presentations</Option>
                <Option value="Credentials">Credentials</Option>
                <Option value="RFP">RFP</Option>
                <Option value="AI Work">AI Work</Option>
                <Option value="Creative Work">Creative Work</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select category">
                <Option value="Simple">Simple</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Complex">Complex</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Date Received"
              name="dateReceived"
              rules={[{ required: true, message: 'Please select date received' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) => current && current.isAfter(dayjs())}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Date Delivered"
              name="dateDelivered"
              rules={[
                { required: true, message: 'Please select delivery date' },
                { validator: validateDeliveryDate },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs().subtract(1, 'day'))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Contact Person"
              name="contactPerson"
              rules={[{ required: true, message: 'Please enter contact person' }]}
            >
              <Input placeholder="Enter contact person" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="End Client Name"
              name="endClient"
              rules={[{ required: true, message: 'Please enter end client name' }]}
            >
              <Input placeholder="Enter end client name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" block>
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProjectPage;
