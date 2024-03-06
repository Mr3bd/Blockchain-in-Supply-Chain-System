<!-- DashboardPage.vue -->
<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome, {{ account }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { getAccount, logout } from '../../web3Service'; // Import the logout function

export default {
  name: 'DashboardPage',
  setup() {
    const account = getAccount();

    const logout = () => {
      logout(); // Call the logout function
    };

    return { account, logout };
  }
};
</script>