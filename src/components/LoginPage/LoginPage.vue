<script setup lang="ts">
import HelloWorld from './HelloWorld.vue'
import LoginForm from './LoginForm.vue'
import CustomParticles from './Particles.vue'
</script>

<template>
  <div class='login'>
    <header>
      <img alt="BSC Logo" class="logo" src="../../assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="BSC" />
      </div>
    </header>

    <main>
      <LoginForm />
      <CustomParticles :backgroundColor="'#10151a'" />
    </main>

    <footer>
      <p>Powered by <a href="https://www.psut.edu.jo/" target="_blank">PSUT</a></p>
    </footer>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Make the login section fill the entire viewport height */
}
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    align-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin-right: 2rem;
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
