<!-- LoginForm.vue -->
<template>

    <div id="login">
       <div id="form">
        <form @submit.prevent="doLogin"  class="form-container">
                    <div class="center-content">

<img alt="MetaMaskLogo" class="logo" src="../../assets/metamask.svg" width="100" height="100" />
<p class="login-text">Login with <span class="bold-text">Meta Mask</span></p>
          <button @click="login">Log in</button></div>
        </form>
      </div></div>

</template>

<script>
import { initWeb3 } from '../../web3Service'; // Import the web3Service.js file

export default {
  name: 'LoginPage',
  methods: {
    async login() {
      try {
        await initWeb3(); // Initialize Web3 and connect to MetaMask
        // Optionally, you can perform further authentication checks here
        // Redirect the user to the dashboard page or perform other actions upon successful login
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in with MetaMask:', error);
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Verdana, sans-serif;
}

.bold-text {
  font-weight: bold; /* Make text bold */
  color: #f6851b; /* Set specific color */
}
.center-content {
  text-align: center; /* Center content horizontally */
}
.login-text {
  margin-top: 20px; /* Add margin top */
  margin-bottom: 20px; /* Add margin bottom */
}

.form-container {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */

}

div#login {
  align-items: center;
  display: flex;
  justify-content: center;
}

div#login div#form {
  background-color: var(--vt-c-indigo);
  border-radius: 8px;
  box-shadow: 0px 0px 16px 0pxrgb(16, 16, 16)6;
  color: #ecf0f1;
  width: 260px;
  padding: 35px;
}

div#login div#form label,
div#login div#form input {
  outline: none;
  width: 100%;
}

div#login div#form label {
  color: #95a5a6;
  font-size: 0.8em;
}

div#login div#form input {
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 1em;
  margin-bottom: 20px;
}

div#login div#form ::placeholder {
  color: #ecf0f1;
  opacity: 1;
}

div#login div#form button {
  background-color:  var(--vt-c-primary);
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  color:  var(--vt-c-white);
  border-radius: 8px;

}

div#login div#form button:hover {
  background-color: #eeeeee;
  color: var(--vt-c-primary);
}

@media screen and (max-width: 600px) {
  div#login {
    align-items: unset;
    background-color: unset;
    display: unset;
    justify-content: unset;
  }



  div#login div#form {
    border-radius: unset;
    box-shadow: unset;
    width: 100%;
  }

  div#login div#form form {
    margin: 0 auto;
    max-width: 280px;
    width: 100%;
  }
}
</style>