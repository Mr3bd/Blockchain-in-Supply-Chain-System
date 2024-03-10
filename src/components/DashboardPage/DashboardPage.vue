<script setup>
import Sidebar from './Sidebar.vue'
// import { getAccount } from '../../web3Service'; // Import the logout function with a different name

// export default {
//   name: 'DashboardPage',
//   setup() {
//     const account = getAccount();
//     return {account};
//   }
// };/
</script>

<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Content -->
    <router-view />
  </div>
</template>


<style lang="scss">
:root {
  --primary: #00a36c;
  --primary-alt: #00a36c;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>
