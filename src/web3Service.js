// web3Service.js
import { ref } from 'vue';
import Web3 from 'web3';

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