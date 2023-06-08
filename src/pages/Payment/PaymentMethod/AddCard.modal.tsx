import { Button, Input, InputNumber, message, Modal } from "antd";
import { useEffect, useState } from "react";
import "./AddCard.modal.css";
import CreditCardInput from "react-credit-card-input";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { setupIntentStripe } from "../../../api/payment";

export interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
}

const stripePromise = loadStripe(
  "pk_test_51KJcGhL9EH0LGofeonRJxKuv4AgWov9rclCX9Rga6yIQ6mkZQacXPVc6BnAIlwft9tVUGjKujuuynfKzmb3irAyF00VyM32x4E"
);

const AddCardModal = ({
  visible,
  setVisible,
  onClose,
  paymentMethods,
  setPaymentMethods,
}) => {
  const [setupIntentToken, setSetupIntentToken] = useState("");

  const setupIntent = useMutation({
    mutationKey: ["setupIntent"],
    mutationFn: setupIntentStripe,
    onSuccess: ({ data }) => {
      setSetupIntentToken(data.result?.client_secret);
    },
  });
  useEffect(() => {
    setupIntent.mutate();
  }, []);

  return (
    visible && (
      <Modal
        title="Add Card"
        open={visible}
        onCancel={onClose}
        footer={[]}
        afterClose={() => {
          // console.log("close modal");
          message.info("Close modal");
        }}
      >
        <div className="add-card-modal">
          <div className="card-info">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                setupIntentToken={setupIntentToken}
                setModalVisible={setVisible}
                setPaymentMethods={setPaymentMethods}
                paymentMethods={paymentMethods}
              />
            </Elements>
          </div>
        </div>
      </Modal>
    )
  );
};

export default AddCardModal;
