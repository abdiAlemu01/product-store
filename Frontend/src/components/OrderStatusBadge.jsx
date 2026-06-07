import { getStatusBadgeClass } from "../lib/orderStatus";

function OrderStatusBadge({ status, className = "" }) {
  return (
    <div className={`badge badge-sm ${getStatusBadgeClass(status)} ${className}`}>
      {status}
    </div>
  );
}

export default OrderStatusBadge;
