// web3Service.js
import Web3 from 'web3';
import { ref } from 'vue';
import router from './router'; // Import the Vue Router instance

let web3;
let accounts;
const account = ref(null);

export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
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
  account.value = newAccounts[0];
};

export const getAccount = () => {
  return account;
};

// Function to clear user authentication state (logout)
export const logout = () => {
  // Clear authentication token from local storage (if applicable)
  // localStorage.removeItem('token');

  // Clear any other user-related data from local storage or session storage
  // localStorage.removeItem('user');

  console.log('Logging out...');
  account.value = null;
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(() => {
      // Redirect to login page
      router.push('/login');
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  console.log('Navigating to login page...');
  router.push('/login'); // Redirect to login page
};
