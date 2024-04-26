<script setup>
import Sidebar from './Sidebar.vue'
import AppBar from '../AppBar.vue'

</script>

<template>
  <div class="dashboard">
    <!-- App Bar -->


    <div class="main-content">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Content -->
      <div class="content">
        <AppBar />
        <router-view />
      </div>
    </div>
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
  background: var(--color-background);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>
