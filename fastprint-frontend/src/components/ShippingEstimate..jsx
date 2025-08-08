import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../services/baseURL";
const ShippingEstimate = () => {
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    postal_code: "",
  });

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchShippingRates = async () => {
    const { country, state, city, postal_code } = address;

    if (!country || !state || !city || !postal_code) {
      setShippingOptions([]);
      setSelectedOption(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setShippingOptions([]);
    setSelectedOption(null);

    try {
      const res = await axios.post(`${BASE_URL}api/shipping-rate/`, {
        ...address,
        account_type: "individual", // always send individual
      });

      // Backend returns available_services array
      // Map it to frontend expected fields: service, rate, estimated_days
      const services = res.data.available_services || [];

      if (services.length === 0) {
        setError("No shipping options available for this address.");
      }

      const options = services.map((s) => ({
        service: s.service_name,
        rate: s.total_charge,
        estimated_days: s.delivery_time,
        courier_name: s.courier_name,
      }));

      setShippingOptions(options);
    } catch (err) {
      console.error("Shipping fetch error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch shipping options. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce fetch on address change
    const timer = setTimeout(() => {
      fetchShippingRates();
    }, 500);

    return () => clearTimeout(timer);
  }, [address.country, address.state, address.city, address.postal_code]);

  return (
    <div className="mt-6 p-4 bg-white border border-blue-200 rounded shadow-sm">
      <h3 className="font-semibold text-blue-700 text-lg mb-4">Shipping Estimate</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="country"
          placeholder="Country (e.g., US)"
          value={address.country}
          onChange={handleAddressChange}
          className="w-full border px-3 py-2 rounded"
          
        />
        <input
          type="text"
          name="state"
          placeholder="State (e.g., TX)"
          value={address.state}
          onChange={handleAddressChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleAddressChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Postal Code"
          value={address.postal_code}
          onChange={handleAddressChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {loading && <p className="mt-4 text-blue-600">Loading shipping options...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {shippingOptions.length > 0 && (
        <div className="mt-5">
          <label className="block mb-2 font-medium text-gray-700">Select Shipping Option:</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedOption?.service || ""}
            onChange={(e) => {
              const selected = shippingOptions.find((opt) => opt.service === e.target.value);
              setSelectedOption(selected);
            }}
            disabled={loading}
          >
            <option value="">-- Select --</option>
            {shippingOptions.map((option, index) => (
              <option key={index} value={option.service}>
                {option.courier_name} - {option.service} — ${option.rate} — {option.estimated_days}
              </option>
            ))}
          </select>

          {selectedOption && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 font-medium">
                Shipping Rate: <span className="font-bold">${selectedOption.rate}</span>
              </p>
              <p className="text-blue-800 font-medium">
                Estimated Delivery:{" "}
                <span className="font-bold">{selectedOption.estimated_days}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingEstimate;
