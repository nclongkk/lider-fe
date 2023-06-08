import { Button, Form, Input, Row, Col, message, notification } from "antd";
import { useState } from "react";
import { login, register } from "../api/auth";
import { useNotify } from "../hooks/useNotify";
import { useRouter } from "../hooks/useRouter";
import { removeStorage, setStorage } from "../utils";

interface RegisterForm {
  email: string;
  password: string;
  confirm: string;
  name: string;
}
export const Register = () => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    setLoading(true);
    if (values.confirm !== values.password) {
      message.error("Password and confirm password must be same");
      setLoading(false);
      return;
    }
    try {
      const { data } = await register({
        email: values.email,
        password: values.password,
        fullName: values.name,
      });
      navigate("/login", { replace: true });
      notification.success({
        message: "Register Successful",
        description: "Please verify your email to login",
      });
    } catch (e) {
      message.error("Register Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="basic"
      initialValues={{
        email: "",
        name: "",
        password: "",
        confirm: "",
      }}
      onFinish={onFinish}
      autoComplete="off"
      className="min-h-screen bg-gray-50 flex flex-col justify-center"
    >
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto"></div>
        <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">
              Name
            </label>
            <Form.Item name="name">
              <Input
                type="text"
                name="name"
                className="w-full p-2 border border-blue-300 rounded mt-"
                required
              />
            </Form.Item>
          </div>
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">
              Email
            </label>
            <Form.Item name="email">
              <Input
                type="text"
                name="email"
                className="w-full p-2 border border-blue-300 rounded mt-"
                required
              />
            </Form.Item>
          </div>
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <Form.Item name="password">
              <Input.Password
                type="password"
                name="password"
                className="w-full p-2 border border-blue-300 rounded mt-1"
                required
              />
            </Form.Item>
          </div>
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">
              Confirm Password
            </label>
            <Form.Item name="confirm">
              <Input.Password
                type="password"
                name="confirm"
                className="w-full p-2 border border-blue-300 rounded mt-1"
                required
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
          <div>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => navigate("/login")}
                className="bg-rose-600 w-full"
              >
                Cancel
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </Form>
  );
};
