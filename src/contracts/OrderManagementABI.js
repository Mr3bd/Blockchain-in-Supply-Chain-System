// QaManagementABI.js
const orderContractAddress = "0x4a3c9603A3C48e980479Fce7727A5A662E3F650a";

const OrderManagementABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_productContractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
    ],
    name: "OrderAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_productId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_status",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cost",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_ownerUser",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_pq",
        type: "uint256",
      },
    ],
    name: "addOrder",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newStatus",
        type: "uint256",
      },
    ],
    name: "changeOrderStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "orderCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "orders",
    outputs: [
      {
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "productContract",
    outputs: [
      {
        internalType: "contract ProductManagementInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export { OrderManagementABI, orderContractAddress };
