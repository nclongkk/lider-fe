import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";

const PrepareContainer: React.FC = () => {
  const text =
    '<div id="lider-container" style="width: 500px; height: 500px"></div>';
  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  return (
    <div>
      <p>Prepare a container to embed meeting area.</p>
      <p>Example:</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
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
            height: "40px",
            borderRadius: "0px",
            borderStyle: "none",

            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        >
          {text}
        </p>
        <Button
          style={{
            height: "40px",
            borderRadius: "0px",
            borderStyle: "none",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            borderLeftStyle: "solid",
            borderLeftWidth: "1px",
            borderLeftColor: "#d9d9d9",
          }}
          onClick={copyToClipboard}
        >
          <CopyOutlined />
        </Button>
      </div>
    </div>
  );
};

export default PrepareContainer;
