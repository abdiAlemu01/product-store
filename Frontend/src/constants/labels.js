export const LABELS = {
  order: "Ajajadha",
  viewDetails: "Bal'ina isaa",
  cancel: "Balleessi",
  confirm: "Mirkaneessi",
  quantity: "Baay'ina",
  chat: "Haasaa",
  chatWithAdmin: "Bulchiinsa waliin haasaa",
  adminChatTitle: "Haasaa maamiltootaa",
  noMessages: "Ergaan hin jiru. Haasaa jalqabi!",
  typeMessage: "Ergaa barreessi...",
  refresh: "Haaromsi",
  notifications: "Beeksisa",
  noNotifications: "Beeksisa hin jiru",
  markAllRead: "Hunda dubbifameera",
  orderPlaced: "Ajajni kee galmaa'eera",
  orderAccepted: "Ajajni kee fudhatameera",
  orderRejected: "Ajajni kee didameera",
  orderDeleted: "Ajajni baleeffameera",
  accept: "Fudhadhu",
  reject: "Didi",
  rejectReason: "Sababa diduu",
  rejectTitle: "Ajaja diduu",
  selectCustomer: "Maamilaa filadhu",
  chattingWith: "Haasaa gochuu",
  reOrder: "Ajaja #",
  customOrder: "Ajaja addaa",
  loadingMessages: "Ergaa fe'aa jira...",
};

export const STATUS_LABELS = {
  Placed: "Ergameera",
  Accepted: "Fudhatameera",
  Rejected: "Didameera",
};

export const getStatusLabel = (status) => STATUS_LABELS[status] || status;
