import { CopyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button } from "antd";

const InitLiderModel: React.FC = () => {
  const data = `<script>
  const lider = new LiderClient("lider-container");
  lider.join({
    accessType: "public", // Access type of your room, we have 2 types: public and askToJoin
    token: "your_app_token", // Token of your app
    roomId: "roomId", // Room ID, this field is required and decide the room of your clients
    user: {
      username: "username", // Username of client
      avatar: "avatar", // Avatar of client
    },
  });
</script>`;

  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = data;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f6b0001a",
          padding: "12px 24px",
          borderRadius: "8px",
          width: "fit-content",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <WarningOutlined />
          <h4
            style={{
              marginBottom: "0px",
              marginLeft: "8px",
            }}
          >
            Warning
          </h4>
        </div>
        <p>You need to setup your web url before using this model</p>
      </div>

      <div>
        <p>Example Lider Model</p>
        <div
          style={{
            position: "relative",
          }}
        >
          <p
            style={{
              backgroundColor: "#ffffff",
              padding: "12px",
              color: "#000000",
              fontSize: "12px",
              fontFamily: "monospace",
              fontWeight: 500,
              borderRadius: "8px",
              borderStyle: "none",
            }}
          >
            <pre>{data}</pre>
          </p>
          <Button
            style={{
              height: "40px",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
              position: "absolute",
              top: "4px",
              right: "4px",
            }}
            onClick={copyToClipboard}
          >
            <CopyOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitLiderModel;
