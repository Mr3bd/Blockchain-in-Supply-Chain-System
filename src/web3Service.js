// web3Service.js
import Web3 from 'web3';
import { ref } from 'vue';
import router from './router'; // Import the Vue Router instance

let web3;
let accounts;
const account = ref(null);

export const initWeb3 = async (origin) => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access every time
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      accounts = await web3.eth.getAccounts();
      account.value = accounts[0];
      // Listen for account change
      window.ethereum.on('accountsChanged', handleAccountChange);
    } catch (error) {
      console.error('User denied account access');
    }

  } else {
    console.error('Please install MetaMask');
  }
};

const handleAccountChange = (newAccounts) => {
  if (newAccounts.length == 0) {
    logout();
  }
  else{
    login();
  }
};

export const getAccount = () => {
  return account;
};

// Function to clear user authentication state (logout)
export const logout = () => {
  console.log('Logging out...');

  account.value = null;
  
  window.location.reload();
  
  router.push('/login'); // Redirect to login page
  
  console.log('Navigating to login page...');
};


export const login = async () =>  {

  account.value = newAccounts[0];

  router.push('/dashboard'); // Redirect to login page

}