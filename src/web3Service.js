// web3Service.js
import Web3 from "web3";
import { ref } from "vue";
import router from "./router"; // Import the Vue Router instance

let web3;
let accounts;
const account = ref(null);

// Define the handleAccountsChanged function
const handleAccountsChanged = (newAccounts) => {
  if (newAccounts != null) {
    if (newAccounts.length == 0) {
      logout();
    } else {
      accounts = newAccounts;
      login();
    }
  } else {
    logout();
  }
};
export const initWeb3 = async () => {
  // Listen for the accountsChanged event

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();

    if (accounts != null) {
      if (accounts.length == 0) {
        accounts = null;
      } else {
        account.value = accounts[0];
      }
    }

    console.log("initWeb3 => Account: " + account.value);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  } else {
    console.error("MetaMask not detected");
  }
};

export const openMetaMask = async () => {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.ethereum.on("accountsChanged", handleAccountChange);
  }
};

export const getAccount = () => {
  return account;
};

export const getAccounts = () => {
  return accounts;
};

// Function to clear user authentication state (logout)
export const logout = () => {
  console.log("Logging out...");
  accounts = null;
  account.value = null;
  // window.location.reload();
  router.push("/login"); // Redirect to login page
  console.log("Navigating to login page...");
};

export const login = async () => {
  account.value = accounts[0];
  router.push("/dashboard"); // Redirect to login page
};
