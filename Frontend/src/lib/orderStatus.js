export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Accepted":
      return "badge-success";
    case "Rejected":
      return "badge-error";
    case "Placed":
      return "badge-warning";
    default:
      return "badge-ghost";
  }
};
