
<template>
  <div class="dashboard">
    <!-- App Bar -->


    <div class="main-content">
      <!-- Sidebar -->
      <Sidebar />
      <CustomParticles :backgroundColor="'#f4f7fa'" :numberOfParts=20 :numberClick=0 />
      <!-- Content -->
      <div class="content">
        <AppBar />
        <router-view />
        <div class="copyright">
          <p>Powered by <a href="https://www.psut.edu.jo/" target="_blank">PSUT Students</a></p>
        </div>
      </div>

    </div>

  </div>
</template>



<script setup>
import Sidebar from './Sidebar.vue'
import AppBar from '../AppBar.vue'
import CustomParticles from '../LoginPage/Particles.vue'
import { user } from '@/globalVariables';
import router from "@/router.js"; // Import the Vue Router instance


// Determine the default route based on the user's role
const defaultRoute = () => {
  if (user.value.id != null) {


    switch (user.value.role_info.role_id) {
      case 1:
        return "/dashboard/users";
      case 2:
        return "/dashboard/materials";
      case 3:
        return "/dashboard/products";
      case 4:
        return "/dashboard/qarequests";
      case 5:
        return "/dashboard/shippingrequests";
      case 6:
        return "/dashboard/store";
      default:
        return ""; // Default to "Users" for other roles
    }
  }
  else {
    return "";
  }
}
if (defaultRoute != "") {
  router.replace(defaultRoute());
}

</script>
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
