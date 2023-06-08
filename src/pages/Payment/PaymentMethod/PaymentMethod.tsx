import "./PaymentMethod.css";
import mastercardLogo from "../../../assets/mastercard.png";
import visaLogo from "../../../assets/visa.png";
import paypalLogo from "../../../assets/paypal.webp";
import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  message,
  Radio,
  RadioChangeEvent,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMemo, useState } from "react";
import AddCardModal from "./AddCard.modal";
import {
  getPaymentMethods,
  updateDefaultPaymentMethodFn,
} from "../../../api/payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import PaymentMethodTable from "../../../components/PaymentMethodTable";
import { chooseCard } from "../../../utils";
import { SummaryForm } from "./SummaryForm";

const PaymentMethod: React.FC = () => {
  const [visibleAddCard, setVisibleAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string>("");
  const [isShowSummaryViewCreditCard, setIsShowSummaryViewreditCard] =
    useState(false);

  const [isShowSummaryViewPaypal, setIsShowSummaryViewPaypal] = useState(false);
  // const onRadioChange = (e: RadioChangeEvent) => {
  //   updateDefaultPaymentMethod.mutate({ paymentMethodId: e.target.value });
  // };

  const { data, isFetched } = useQuery({
    queryKey: ["getPayments"],
    queryFn: getPaymentMethods,
    onSuccess: ({ data }) => {
      console.log(data);
      data.result.length > 0 &&
        data.result.forEach((paymentMethod) => {
          if (paymentMethod.default) {
            setDefaultPaymentMethod(paymentMethod.paymentMethodId);
            return;
          }
        });
      setPaymentMethods(data.result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  return (
    <div>
      <div className="payment-method">
        {/* <div className="main-info"> */}
        <Row
          style={{
            marginBottom: "1rem",
          }}
          gutter={[16, 16]}
        >
          <Col span={16}>
            <div
              style={{
                backgroundColor: "#ffffff",
              }}
            >
              <div
                className="title"
                onClick={() => {
                  setIsShowSummaryViewreditCard((prev) => !prev);
                  setIsShowSummaryViewPaypal(false);
                }}
              >
                <div
                  style={{
                    margin: "16px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <WalletOutlined className="card-title" />
                    <p className="card-title">Credit Card</p>
                  </div>
                  {isShowSummaryViewCreditCard ? (
                    <LeftOutlined />
                  ) : (
                    <RightOutlined />
                  )}
                </div>
              </div>

              {/* <Radio.Group value={defaultPaymentMethod} onChange={onRadioChange}>
            {!!isFetched && */}
              {/* paymentMethods.map((paymentMethod) => ( */}
              <PaymentMethodTable
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
                defaultMethodID={defaultPaymentMethod}
                setDefaultMethodID={setDefaultPaymentMethod}
              />
              {/* ))}
          </Radio.Group> */}
              <div>
                <Button
                  className="add-new-card-btn"
                  onClick={() => setVisibleAddCard(true)}
                >
                  <PlusOutlined />
                  Add New Card
                </Button>
                {visibleAddCard && (
                  <AddCardModal
                    visible={visibleAddCard}
                    setVisible={setVisibleAddCard}
                    onClose={() => {
                      setVisibleAddCard(false);
                    }}
                    setPaymentMethods={setPaymentMethods}
                    paymentMethods={paymentMethods}
                  />
                )}
              </div>
            </div>
          </Col>
          {isShowSummaryViewCreditCard && (
            <Col
              span={8}
              style={{
                maxHeight: "25rem",
              }}
            >
              <SummaryForm type="creditCard" />
            </Col>
          )}
        </Row>
        {/* </div> */}

        <Row gutter={[16, 16]}>
          <Col span={16}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
              }}
              onClick={() => {
                setIsShowSummaryViewreditCard(false);
                setIsShowSummaryViewPaypal((prev) => !prev);
              }}
            >
              <div className="title">
                <div
                  style={{
                    margin: "16px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <WalletOutlined className="card-title" />
                    <p className="card-title">PayPal</p>
                  </div>
                  {isShowSummaryViewPaypal ? (
                    <LeftOutlined />
                  ) : (
                    <RightOutlined />
                  )}
                </div>
              </div>
              <div className="card-detail">
                <div className="type card-detail-element">
                  <div className="card-symbol">
                    <img
                      style={{
                        height: "3rem",
                        marginBottom: "0.5rem",
                      }}
                      src={paypalLogo}
                    ></img>
                    {/* <PayPalScriptProvider options={{ "client-id": "test" }}>
                      <PayPalButtons
                        style={{ layout: "horizontal" }}
                        disabled
                      />
                    </PayPalScriptProvider> */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          {isShowSummaryViewPaypal && (
            <Col
              span={8}
              style={{
                maxHeight: "25rem",
              }}
            >
              <SummaryForm type="paypal" />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default PaymentMethod;
