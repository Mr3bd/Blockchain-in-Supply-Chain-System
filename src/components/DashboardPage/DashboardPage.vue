<script setup>
import Sidebar from './Sidebar.vue'
import AppBar from '../AppBar.vue'
import CustomParticles from '../LoginPage/Particles.vue'
</script>

<template>
  <div class="dashboard">
    <!-- App Bar -->


    <div class="main-content">
      <!-- Sidebar -->
      <Sidebar />
      <CustomParticles :backgroundColor="'#f4f7fa'" :numberOfParts=10 :numberClick=0 />
      <!-- Content -->
      <div class="content">
        <AppBar />
        <router-view />
        <div class="copyright">
          <p>Powered by <a href="https://www.psut.edu.jo/" target="_blank">PSUT</a></p>
        </div>
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
