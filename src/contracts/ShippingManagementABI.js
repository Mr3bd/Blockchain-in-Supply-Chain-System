// QaManagementABI.js
const shippingContractAddress = "0xDa65788caDF34481a99a22FD1D3173F69BB2Af1e";

const ShippingManagementABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_orderContractAddress",
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
        name: "reqId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "lgUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "country",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "city",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "street",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "zipcode",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "building",
        type: "string",
      },
    ],
    name: "ShippingRequestAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
    ],
    name: "ShippingRequestStatusChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_lgUser",
        type: "address",
      },
    ],
    name: "acceptShippingRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_reward",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_country",
        type: "string",
      },
      {
        internalType: "string",
        name: "_city",
        type: "string",
      },
      {
        internalType: "string",
        name: "_street",
        type: "string",
      },
      {
        internalType: "string",
        name: "_zipcode",
        type: "string",
      },
      {
        internalType: "string",
        name: "_building",
        type: "string",
      },
    ],
    name: "addShippingRequest",
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
        name: "_id",
        type: "uint256",
      },
    ],
    name: "cancelshippingRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "completeShippingRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "orderContract",
    outputs: [
      {
        internalType: "contract OrderManagementInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "requestCount",
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
    name: "shippingRequests",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "lgUser",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "country",
        type: "string",
      },
      {
        internalType: "string",
        name: "city",
        type: "string",
      },
      {
        internalType: "string",
        name: "streen",
        type: "string",
      },
      {
        internalType: "string",
        name: "zipcode",
        type: "string",
      },
      {
        internalType: "string",
        name: "building",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export { ShippingManagementABI, shippingContractAddress };
