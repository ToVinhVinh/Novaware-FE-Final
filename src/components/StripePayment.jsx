import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "@material-ui/core";
import Loader from "./Loader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ totalPrice, handleStripePayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/create-payment-intent", {
        totalPrice,
      });
      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          handleStripePayment(result.paymentIntent);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      {error && <div style={{ color: "secondary", marginTop: "10px" }}>{error}</div>}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="secondary"
        disabled={!stripe || loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? <Loader /> : `Pay $${totalPrice}`}
      </Button>
    </form>
  );
};

const StripePayment = ({ orderId, totalPrice, handleStripePayment }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        orderId={orderId}
        totalPrice={totalPrice}
        handleStripePayment={handleStripePayment}
      />
    </Elements>
  );
};

export default StripePayment;
