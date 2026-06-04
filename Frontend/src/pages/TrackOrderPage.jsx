import { PackageSearchIcon, TruckIcon } from "lucide-react";
import { useState } from "react";

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      // Mock tracking result
      setTrackingResult({
        orderNumber: orderNumber,
        status: "In Transit",
        estimatedDelivery: "Dec 25, 2024",
        location: "Distribution Center",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <PackageSearchIcon className="size-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-lg text-base-content/70">
            Enter your order number to track your shipment
          </p>
        </div>

        {/* Tracking Form */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Order Number</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-12345)"
                  className="input input-bordered w-full"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <PackageSearchIcon className="size-5 mr-2" />
                Track Order
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <TruckIcon className="size-6 text-primary" />
                Tracking Information
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                  <span className="font-medium">Order Number:</span>
                  <span className="text-primary font-semibold">
                    {trackingResult.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                  <span className="font-medium">Status:</span>
                  <span className="badge badge-success badge-lg">
                    {trackingResult.status}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                  <span className="font-medium">Current Location:</span>
                  <span>{trackingResult.location}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                  <span className="font-medium">Estimated Delivery:</span>
                  <span className="font-semibold">{trackingResult.estimatedDelivery}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Order Timeline</h3>
                <ul className="steps steps-vertical">
                  <li className="step step-primary">Order Placed</li>
                  <li className="step step-primary">Processing</li>
                  <li className="step step-primary">In Transit</li>
                  <li className="step">Out for Delivery</li>
                  <li className="step">Delivered</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-base-content/60">
          <p>
            Can't find your order? Contact our{" "}
            <a href="/contact" className="link link-primary">
              customer support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;
