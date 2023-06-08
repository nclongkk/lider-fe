import { Layout } from "antd";
import { Route } from "../routes/PrivateRoute";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  routes: Route[];
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <Layout className="min-h-screen">
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};
