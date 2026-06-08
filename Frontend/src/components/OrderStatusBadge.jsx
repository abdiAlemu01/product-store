import { getStatusBadgeClass } from "../lib/orderStatus";
import { getStatusLabel } from "../constants/labels";

function OrderStatusBadge({ status, className = "" }) {
  return (
    <div className={`badge badge-sm ${getStatusBadgeClass(status)} ${className}`}>
      {getStatusLabel(status)}
    </div>
  );
}

export default OrderStatusBadge;
