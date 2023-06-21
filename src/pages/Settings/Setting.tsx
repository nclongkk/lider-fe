import { ReloadOutlined } from "@ant-design/icons";
import { Button, Collapse, Input, Modal, notification, Steps } from "antd";
import "./Setting.css";
import Paragraph from "antd/es/typography/Paragraph";
import EmbedCdn from "./SetupGuide/EmbedCdn";
import PrepareContainer from "./SetupGuide/PrepareContainer";
import InitLiderModel from "./SetupGuide/InitModel";
import { generateToken, getAppDetail, updateAppUrl } from "../../api/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
interface AppDetail {
  _id: string;
  webUrl: string;
  token: string;
}

const { Panel } = Collapse;
const Setting: React.FC = () => {
  const [appDetail, setAppDetail] = useState<AppDetail>();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const generateTokenFn = useMutation({
    mutationKey: ["generateToken"],
    mutationFn: generateToken,
    onSuccess: ({ data }) => {
      const { token } = data.result;
      console.log(token);
      setAppDetail((prev) => {
        if (prev) {
          return { ...prev, token };
        }
        return prev;
      });
    },
  });

  const updateWebUrl = useMutation({
    mutationKey: ["updateWebUrl"],
    mutationFn: updateAppUrl,
    onSuccess: ({ data }) => {
      const { webUrl } = data.result;
      setAppDetail((prev) => {
        if (prev) {
          return { ...prev, webUrl };
        }
        return prev;
      });
      notification.success({
        message: "Update web url successfully",
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["appDetail"],
    queryFn: getAppDetail,
    select: ({ data }) => data?.result,
    onSuccess: (data) => {
      setAppDetail(data);
    },
  });
  return (
    <>
      <div
        style={{
          width: "80%",
          // marginTop: "40px ",
          margin: "20px auto",
          // marginLeft: "40px",
          marginLeft: "auto",
        }}
      >
        <Collapse
          style={{
            marginBottom: "20px",
          }}
          defaultActiveKey={["1"]}
        >
          <Panel header="App information" key="1">
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: "16px",
                    }}
                  >
                    Token:
                  </span>
                  <Paragraph
                    copyable
                    style={{
                      marginLeft: "20px",
                      marginBottom: "0px",
                      marginRight: "20px",
                      fontFamily: "monospace",
                    }}
                  >
                    {appDetail?.token}
                  </Paragraph>
                  <Button
                    style={{
                      borderStyle: "none",
                    }}
                    onClick={() => {
                      setConfirmModalVisible(!confirmModalVisible);
                    }}
                  >
                    <ReloadOutlined></ReloadOutlined>
                  </Button>
                </div>
              </div>
              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                >
                  Website URL which you want to integrate our service
                </p>
                <Paragraph
                  editable={{
                    onChange: (value) => {
                      updateWebUrl.mutate({ webUrl: value });
                    },
                  }}
                  style={{
                    width: "fit-content",
                    marginBottom: "0px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "#d9d9d9",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                >
                  {appDetail?.webUrl}
                </Paragraph>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Setup guide" key="1">
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f6f6f6",
                  padding: "24px",
                  borderRadius: "8px",
                  margin: "16px 12px",
                }}
              >
                <Steps direction="vertical">
                  <Steps.Step
                    title="Embed Lider SDK"
                    description={<EmbedCdn />}
                  ></Steps.Step>
                  <Steps.Step
                    title="Prepare container"
                    description={<PrepareContainer />}
                  ></Steps.Step>
                  <Steps.Step
                    title="Initiate Lider model with the custom decorators"
                    description={<InitLiderModel />}
                  ></Steps.Step>
                </Steps>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      {confirmModalVisible && (
        <Modal
          visible={confirmModalVisible}
          onOk={() => {
            setConfirmModalVisible(false);
          }}
          onCancel={() => {
            setConfirmModalVisible(false);
          }}
          footer={null}
          closable={false}
          maskClosable={false}
          destroyOnClose={true}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Are you sure to regenerate token? The old token you have will be
              no longer valid.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                style={{
                  marginRight: "20px",
                }}
                onClick={() => {
                  setConfirmModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  generateTokenFn.mutate();
                  setConfirmModalVisible(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Setting;
