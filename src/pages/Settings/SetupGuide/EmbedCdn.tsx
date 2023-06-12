import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";

const EmbedCdn: React.FC = () => {
  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value =
      '<script src="https://meet-lider.it-pfiev-dut.tech/public-sdk.js"></script>';
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  return (
    <div>
      <p>
        Include the following Javascrip tag before the end of the body element
      </p>
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
          {
            '<script src="https://meet-lider.it-pfiev-dut.tech/public-sdk.js"></script>'
          }
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
export default EmbedCdn;
