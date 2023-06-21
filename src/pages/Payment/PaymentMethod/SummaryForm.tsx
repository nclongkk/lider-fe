import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation } from "@tanstack/react-query";
import { Typography, InputNumber, Divider, Button, message, Alert } from "antd";
import { useEffect, useState } from "react";
import {
  capturePayPalPaymentFn,
  requestPayPalPaymentFn,
  requetsPaymentIntentFn,
} from "../../../api/payment";
interface Props {
  type: "paypal" | "creditCard";
  handleSubmit?: () => void;
}
export const SummaryForm = ({ type, handleSubmit }: Props) => {
  const [inputValue, setInputValue] = useState<number | null>(0);
  const [formValue, setFormValue] = useState<{
    tax: number;
    serviceFee: number;
    total: number;
  }>({
    tax: 0,
    serviceFee: 0,
    total: 0,
  });

  const requestPaymentStripe = useMutation({
    mutationKey: ["requestPaymentStripe"],
    mutationFn: requetsPaymentIntentFn,
    onSuccess: ({ data }) => {
      message.success("Request payment successfully");
    },
    onError: (error: any) => {
      message.error(error.response.data.message);
    },
  });

  const requestPaymentPayPal = useMutation({
    mutationKey: ["requestPaymentPayPal"],
    mutationFn: requestPayPalPaymentFn,
    onError: (error: any) => {
      message.error(error.response.data.message);
    },
  });

  const capturePaymentPayPal = useMutation({
    mutationKey: ["capturePaymentPayPal"],
    mutationFn: capturePayPalPaymentFn,
    onError: (error: any) => {
      message.error(error.response.data.message);
    },
    onSuccess: ({ data }) => {
      message.success("Payment successfully");
    },
  });

  return (
    <div
      style={{
        height: "100%",
        padding: "1rem",
        borderRadius: "1rem",
        backgroundColor: "#ffffff",
        // width: "100%",
      }}
    >
      <Typography.Title
        level={4}
        style={{
          color: "rbg(22,33,62)",
        }}
      >
        Summary
      </Typography.Title>
      <InputNumber
        addonAfter="$"
        defaultValue={0}
        onChange={(e) => {
          e = e || 0;
          console.log("input value", e);
          setInputValue(e);
          setFormValue({
            tax: Math.round(e * 0.03 * 100) / 100,
            serviceFee: Math.round(e * 0.03 * 100) / 100,
            total: Math.round(e * 1.06 * 100) / 100,
          });
          console.log("form value", formValue);
        }}
      />
      <Divider />
      <div>
        <div className="invoice-item">
          <Typography.Text
            style={{
              color: "rgba(22, 33, 62, 0.5)",
              fontSize: "0.875rem",
            }}
          >
            {type === "paypal" ? "Paypal Fee" : "Credit Card Fee"}
          </Typography.Text>
          <Typography.Text
            strong
            style={{
              color: "rbg(22,33,62)",
              fontSize: "1rem",
            }}
          >
            ${formValue.tax}
          </Typography.Text>
        </div>
        <div className="invoice-item">
          <Typography.Text
            style={{
              color: "rgba(22, 33, 62, 0.5)",
              fontSize: "0.875rem",
            }}
          >
            Tax (3%)
          </Typography.Text>
          <Typography.Text
            strong
            style={{
              color: "rbg(22,33,62)",
              fontSize: "1rem",
            }}
          >
            ${formValue.tax}
          </Typography.Text>
        </div>

        <div className="invoice-item">
          <Typography.Text
            style={{
              color: "rgba(22, 33, 62, 0.5)",
              fontSize: "0.875rem",
            }}
          >
            Service Fee (3%)
          </Typography.Text>
          <Typography.Text
            strong
            style={{
              color: "rbg(22,33,62)",
              fontSize: "1rem",
            }}
          >
            ${formValue.serviceFee}
          </Typography.Text>
        </div>
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Text
          style={{
            fontSize: "1.5rem",
            color: "rgba(22, 33, 62, 0.5)",
          }}
        >
          Total Amount
        </Typography.Text>
        <Typography.Text
          strong
          style={{
            color: "rbg(22,33,62)",
            fontSize: "1rem",
          }}
        >
          ${formValue.total}
        </Typography.Text>
      </div>
      {type === "creditCard" && (
        <Button
          style={{
            width: "100%",
            backgroundColor: "rgb(1,0,129)",
            height: "3rem",
          }}
          onClick={() => {
            requestPaymentStripe.mutate({ amount: inputValue });
          }}
          loading={requestPaymentStripe.isLoading}
        >
          <Typography.Text
            style={{
              color: "white",
            }}
          >
            Top-up
          </Typography.Text>
        </Button>
      )}

      {type === "paypal" && (
        <PayPalScriptProvider
          options={{
            "client-id":
              "AYmlCGgWocwaRKG_5Idtyuf04fAkzyrfBzHg84Cze1UW_PEv2_w2OAeo5AILslK-zch4uopw2BEYuRDm",
          }}
        >
          <PayPalButtons
            //hide credit card option
            style={{
              layout: "horizontal",
              color: "gold",
              shape: "pill",
              label: "paypal",
              tagline: false,
            }}
            disabled={formValue.total <= 0}
            createOrder={async (data, actions) => {
              const { data: order } = await requestPaymentPayPal.mutateAsync({
                amount: 100,
              });
              return order.result.orderId;
            }}
            onApprove={async (data, actions) => {
              console.log(data);
              return capturePaymentPayPal.mutate({ orderId: data.orderID });
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};
