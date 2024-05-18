// web3Service.js
import Web3 from "web3";
import { ref } from "vue";
import router from "./router"; // Import the Vue Router instance
import { postData } from "./apiService.js";
import { user, accountBalance } from "@/globalVariables";

let web3;
let accounts;
const account = ref(null);

// Define the handleAccountsChanged function
const handleAccountsChanged = (newAccounts) => {
  if (newAccounts != null) {
    console.log("(newAccounts != null");
    if (newAccounts.length == 0) {
      logout();
    } else {
      accounts = newAccounts;
      account.value = accounts[0];
      console.log('fsdf');
      window.location.reload();
      
      getLogin();
    }
  } else {
    logout();
  }
};
export const initWeb3 = async () => {
  // Listen for the accountsChanged event
  console.log("initWeb3...");
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();

    if (accounts != null) {
      console.log("Accounts != null...");

      if (accounts.length == 0) {
        console.log("accounts.length == 0...");

        logout();
      } else {
        console.log("accounts.length == 0 else...");
        router.push('/');
        account.value = accounts[0];
      }
    } else {
      console.log("accounts != null else...");

      logout();
    }
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  } else {
    console.error("MetaMask not detected");
  }
};

export const openMetaMask = async () => {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }
};

export const getAccount = () => {
  return account;
};

// Function to clear user authentication state (logout)
export const logout = () => {
  console.log("Logging out...");
  accounts = null;
  account.value = null;
  router.push("/login"); 
  console.log("Navigating to login page...");
};

export const getLogin = async () => {
  postData(
    "login",
    { id: account.value },
    () => {},
    () => {}
  )
    .then((response) => {
      console.log(response);
      if (response["user"] != null) {
        user.value = response["user"];
      }
      set_balance();
    })
    .catch((error) => {
      console.error("Error while making POST request:", error);
     set_balance();
    });
};

export const set_balance = async () => {
  const balanceInWei = await web3.eth.getBalance(getAccount().value);
  const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
  const roundedBalance = parseFloat(balanceInEther).toFixed(4); 
  accountBalance.value = roundedBalance;
};


