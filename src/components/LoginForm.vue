<!-- LoginForm.vue -->
<template>

    <div id="login">
       <div id="form">
        <form @submit.prevent="doLogin">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" placeholder="elon@musk.io" autocomplete="off">

          <label for="password">Password</label>&nbsp;
          <i class="fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></i>
          <input :type="passwordFieldType" id="password" v-model="password" placeholder="**********">

          <button type="submit">Log in</button>
        </form>
      </div></div>

</template>

<script setup>
  import { computed, ref } from "vue";

  const email = ref("");
  const hidePassword = ref(true);
  const password = ref("");

  const passwordFieldIcon = computed(() => hidePassword.value ? "fa-eye" : "fa-eye-slash");
  const passwordFieldType = computed(() => hidePassword.value ? "password" : "text");

  const doLogin = () => alert("Not implemented yet :O");
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Verdana, sans-serif;
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