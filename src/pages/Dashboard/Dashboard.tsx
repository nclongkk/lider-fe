import React, { useState } from "react";
import {
  CodeOutlined,
  HistoryOutlined,
  LoadingOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleFilled,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Switch,
  theme,
  Typography,
} from "antd";
import "./dashboard.css";
import {
  useParams,
  useLocation,
  useNavigate,
  NavLink,
  Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import { removeStorage } from "../../utils";
import logo from "../../assets/logo.png";
import { UserLogout } from "../../components/UserLogout";
import Payment from "../Payment/Payment";
import { useQuery } from "@tanstack/react-query";
import { getUserPaymentDetail } from "../../api/payment";
import Setting from "../Settings/Setting";
import MeetingHistory from "../MeetingHistory/MeetingHistory";
import Overview from "../Overview/Overview";
const { Item } = Menu;

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { data: userPayment, isLoading: userPaymentLoading } = useQuery({
    queryKey: ["userPayment"],
    queryFn: getUserPaymentDetail,
    select: ({ data }) => data?.result,
  });

  const [path, setPath] = useState("/");
  window.location.pathname !== path && setPath(window.location.pathname);
  const { userInfo } = useCurrentUser();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            backgroundColor: "#ffffff",
            height: "80px",
            display: "flex",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {!collapsed && (
            <img
              src={logo}
              style={{
                width: 150,
                margin: "0 auto",
              }}
              alt="logo"
            />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{
            marginTop: "20px",
          }}
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          onClick={(e) => {}}
          // items={[
          //   {
          //     key: "/",
          //     icon: <UserOutlined />,
          //     label: "Home",
          //   },
          //   {
          //     key: "/app",
          //     icon: <CodeOutlined />,
          //     label: "Your App",
          //   },
          //   {
          //     key: "/payment",
          //     icon: <WalletOutlined />,
          //     label: "Payment",
          //   },
          // ]}
        >
          {!collapsed && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0 16px",
              }}
            >
              <Typography.Text
                style={{
                  color: "#010085",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Deposit:
              </Typography.Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "16px",
                }}
              >
                <Typography.Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {userPaymentLoading && <LoadingOutlined />}
                  {!!userPayment &&
                    `$${(userPayment?.deposit as number).toFixed(2)}`}
                </Typography.Text>
                <PlusCircleFilled
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#f7b619",
                  }}
                  onClick={() => {
                    navigate("/payment");
                    setPath("/payment");
                  }}
                ></PlusCircleFilled>
              </div>
            </div>
          )}
          <Divider orientation="left" plain></Divider>
          <Item key="/" icon={<UserOutlined />}>
            <Link to="/" className="nav-text">
              Home
            </Link>
          </Item>
          <Item key="/settings" icon={<CodeOutlined />}>
            <Link to="/settings" className="nav-text">
              Settings
            </Link>
          </Item>
          <Item key="/payment" icon={<WalletOutlined />}>
            <Link to="/payment" className="nav-text">
              Payment
            </Link>
          </Item>
          <Item key="/meeting-history" icon={<HistoryOutlined />}>
            <Link to="/meeting-history" className="nav-text">
              Meeting History
            </Link>
          </Item>
          <Routes>
            <Route path="/meeting-history" element={<MeetingHistory />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/settings" element={<div>App</div>} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex justify-between"
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className={"px-4"}>
            {userInfo && <UserLogout user={userInfo}></UserLogout>}
          </div>
        </Header>
        {/* <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
          }}
        ></Content> */}
        <div style={{ overflow: "auto" }}>
          {path === "/meeting-history" && <MeetingHistory />}
          {path === "/payment" && <Payment />}
          {path === "/settings" && <Setting />}
          {path === "/" && <Overview />}
        </div>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
