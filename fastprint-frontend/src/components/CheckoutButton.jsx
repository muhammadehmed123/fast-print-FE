import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { BASE_URL } from "../services/baseURL"; // import your base URL

const stripePromise = loadStripe(
  "pk_test_51QbTz6RxiPcxiXelLov7aonk68MVy3OVLHYOsdTyOaTH1pQ3FfSql0TjE4WNd0pgzs5qyJUaBXtd3ar5GLP4ESP400FHqiRJF9"
); // your Stripe publishable key

const CheckoutButton = ({ lineItems }) => {
  const handleClick = async () => {
    try {
      const stripe = await stripePromise;

      // Use BASE_URL for backend URL
      const response = await axios.post(`${BASE_URL}api/create-checkout-session/`, {
        items: lineItems,
      });
      const session = response.data;

      if (session.error) {
        alert(session.error);
        return;
      }

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
    >
      Pay with Card
    </button>
  );
};

export default CheckoutButton;
