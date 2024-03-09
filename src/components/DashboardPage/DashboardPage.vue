<!-- DashboardPage.vue -->
<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome, {{ account }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { getAccount, logout as logoutUser } from '../../web3Service'; // Import the logout function with a different name

export default {
  name: 'DashboardPage',
  setup() {
    const account = getAccount();

    const handleLogout = () => {
      logoutUser(); // Call the logout function from web3Service.js
    };

    return { account, handleLogout };
  }
};
</script>
