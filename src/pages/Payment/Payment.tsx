import { Tabs } from "antd";
import "./Payment.css";
import { PaymentHistory } from "./PaymentHistory/PaymentHistory";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
const Payment: React.FC = () => {
  return (
    <div
      style={{
        width: "1000px",
        // marginTop: "40px ",
        margin: "20px auto",
        // marginLeft: "40px",
        marginLeft: "auto",
      }}
    >
      <p className="title">Payment</p>
      <Tabs>
        <Tabs.TabPane tab="Method" key="1">
          <PaymentMethod />
        </Tabs.TabPane>
        <Tabs.TabPane tab="History" key="2">
          <PaymentHistory />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Payment;
