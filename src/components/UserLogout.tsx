import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps } from "antd";
import { User } from "../interfaces/User";

interface Props {
  user: User;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        User Profile
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </a>
    ),
  },
];

export const UserLogout = ({ user }: Props) => {
  return (
    <Dropdown menu={{ items }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          icon={<UserOutlined />}
          style={{
            margin: "0 10px",
          }}
        />

        <p
          style={{
            marginBottom: 0,
          }}
        >
          {user.fullName}
        </p>
      </div>
    </Dropdown>
  );
};
