import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Input, message } from "antd";
import { attachPaymentMethod, setupIntentStripe } from "../../../api/payment";
import { useMutation } from "@tanstack/react-query";

interface Props {
  setupIntentToken: string;
  setModalVisible: any;
  setPaymentMethods: any;
  paymentMethods: any;
}

export const CheckoutForm = ({
  setupIntentToken,
  setModalVisible,
  setPaymentMethods,
  paymentMethods,
}: Props) => {
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardToken, setCardToken] = useState("");

  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const addPaymentMethod = useMutation({
    mutationKey: ["addPaymentMethod"],
    mutationFn: attachPaymentMethod,
    onSuccess: ({ data }) => {
      message.success("Payment method added successfully");
      setModalVisible(false);
      console.log(data.result);
      console.log(paymentMethods);
      setPaymentMethods([...paymentMethods, data.result.card]);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  console.log(setupIntentToken);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { setupIntent, error } = await stripe.confirmCardSetup(
      setupIntentToken,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardName,
          },
        },
      }
    );
    console.log(setupIntent);

    if (error) {
      setProcessing(false);
      setError(error.message ?? "An unknown error occurred.");
      return;
    }

    // setCardToken((setupIntent?.payment_method || "") as string);
    // console.log(cardToken);
    addPaymentMethod.mutate({
      paymentMethodId: (setupIntent?.payment_method || "") as string,
    });
    // Send paymentMethod.id to your server to complete the payment

    setProcessing(false);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="add-card-modal__input">
        <label>Name</label>
        <Input
          className="input-number"
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>
      <div>
        <label>
          Card details
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
              hidePostalCode: true,
            }}
            onChange={(event) => setCardComplete(event.complete)}
          />
        </label>
      </div>
      {error && <div>{error}</div>}
      <button
        style={{
          backgroundColor: "#010081",
          color: "white",
          width: "100%",
          height: "50px",
          borderRadius: "5px",
          border: "none",
          marginTop: "40px",
        }}
        type="submit"
        disabled={!stripe || processing || !cardComplete || !cardName}
      >
        {processing ? "Processing..." : "Add"}
      </button>
    </form>
  );
};
