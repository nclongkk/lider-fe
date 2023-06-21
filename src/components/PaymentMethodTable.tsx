import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  message,
  Radio,
  Table,
  Tooltip,
  Modal,
  Typography,
} from "antd";
import { useState } from "react";
import {
  detachPaymentMethodFn,
  updateDefaultPaymentMethodFn,
} from "../api/payment";
import { chooseCard } from "../utils";

export interface Props {
  paymentMethods: any[];
  setPaymentMethods: (paymentMethods: any[]) => void;
  defaultMethodID: string;
  setDefaultMethodID: (defaultMethodID: string) => void;
}

function PaymentMethodTable({
  paymentMethods,
  setPaymentMethods,
  defaultMethodID,
  setDefaultMethodID,
}: Props) {
  const [currentSelectedRecord, setCurrentSelectedRecord] = useState<any>(null);

  const removeCard = useMutation({
    mutationKey: ["removeCard"],
    mutationFn: detachPaymentMethodFn,
    onSuccess: ({ data }) => {
      const newPaymentMethods = paymentMethods.filter(
        (paymentMethod) =>
          paymentMethod.paymentMethodId !== data.result.paymentMethodId
      );
      setPaymentMethods(newPaymentMethods);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const updateDefaultPaymentMethod = useMutation({
    mutationKey: ["updateDefaultPaymentMethod"],
    mutationFn: updateDefaultPaymentMethodFn,
    onSuccess: ({ data }) => {
      setDefaultMethodID(data.result.paymentMethodId);
      setCurrentSelectedRecord(null);
      message.success("Switch payment method successfully");
      // reload window
      window.location.reload();
    },
  });
  const columns = [
    {
      title: "",
      key: "select",
      render: (_, record) => (
        <Radio
          checked={defaultMethodID === record.paymentMethodId}
          onChange={() => {
            setCurrentSelectedRecord(record);
            // setDefaultMethodID(record.paymentMethodId);
          }}
        />
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (brand) => (
        <Tooltip title={brand.charAt(0).toUpperCase() + brand.slice(1)}>
          <img
            // className="card-img"
            src={chooseCard(brand)}
            style={{
              width: "40px",
              height: "15px",
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Card Number",
      dataIndex: "last4",
      key: "last4",
      render: (last4) => (
        <span className="card-number-span">{`**** **** **** ${last4}`}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, card) => (
        <Button
          className="remove-card-btn"
          onClick={() => {
            console.log(card.paymentMethodId);
            removeCard.mutate({ paymentMethodId: card.paymentMethodId });
          }}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const handleOnOkConfirm = () => {
    updateDefaultPaymentMethod.mutate({
      paymentMethodId: currentSelectedRecord?.paymentMethodId,
    });
  };
  return (
    <>
      <Table dataSource={paymentMethods} columns={columns} pagination={false} />
      {!!currentSelectedRecord && (
        <Modal
          open={currentSelectedRecord}
          onCancel={() => setCurrentSelectedRecord(null)}
          onOk={handleOnOkConfirm}
          title="Confirm switch payment method"
          confirmLoading={updateDefaultPaymentMethod.isLoading}
          footer={
            <>
              <Button
                type="default"
                onClick={() => setCurrentSelectedRecord(null)}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#010085",
                }}
                loading={updateDefaultPaymentMethod.isLoading}
                type="primary"
                onClick={handleOnOkConfirm}
              >
                Confirm
              </Button>
            </>
          }
        >
          <Typography.Text>
            Are you sure to switch payment method ?
          </Typography.Text>
        </Modal>
      )}
    </>
  );
}

export default PaymentMethodTable;
