<template>
   <h1>Add User</h1>
   <div class="container">
      <div class="input-box">
         <label for="wId">Wallet Id:</label>
         <input id="wId" type="text" placeholder="Enter Id" v-model="wId" />
      </div>

      <div class="input-box">
         <label for="uName">Name:</label>
         <input id="uName" type="text" placeholder="Enter name" v-model="uName" />
      </div>
      <div class="input-box" style="margin-bottom: 16px;">
         <label style="margin-right: 8px;">Role:</label>
         <button @click="openRoleSelection" class="role-button">{{ buttonText }}</button>

      </div>
      <button @click="addUser" class="add-button" :class="{ 'disabled': isInvalidData }" :disabled="isInvalidData">
         <span class="material-icons">add</span>
         <span>Add</span>
      </button>

      <Snackbar ref="snackbarRef" />
      <v-bottom-sheet v-model="showRoleSelectionRef">
         <v-list style="background-color: #34495e; ">
            <v-list-item v-for="role in roles" :key="role.id" @click="selectRole(role.id)">
               <v-list-item-title style="display: flex; align-items: center; color: white; margin: 12px;">
                  {{ role.name }}
                  <span v-if="role.id === selectedRoleId" class="material-icons"
                     style="margin-left: 8px; color: #00a36c;">check</span>
               </v-list-item-title>
            </v-list-item>
         </v-list>
      </v-bottom-sheet>

   </div>
</template>

<script>
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import { postData, getData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { ref } from 'vue';

export default {
   setup() {

      const snackbarRef = ref(null);
      const roles = ref([]);
      const selectedRoleId = ref(null);
      const showRoleSelectionRef = ref(false);
      const wId = ref('');
      const uName = ref('');

      const openRoleSelection = async () => {
         getData(`rolesLookUp?page=1&pageSize=100`)
            .then((response) => {
               roles.value = response.roles || [];
               showRoleSelectionRef.value = true;
            }).catch((error) => {
               console.error('Error fetching roles:', error);
            });

      };

      const selectRole = async (roleId) => {
         selectedRoleId.value = roleId;
         showRoleSelectionRef.value = false;
      };

      return {
         wId,
         uName,
         snackbarRef,
         roles,
         selectedRoleId,
         showRoleSelectionRef,
         getAccount,
         selectRole,
         openRoleSelection,
      };
   },

   computed: {
      isInvalidData() {
         return this.wId === '' || this.uName === '' || this.selectedRoleId === null;
      },
      buttonText() {
         if (this.selectedRoleId === null) {
            return 'Select';
         } else {
            const selectedRole = this.roles.find(role => role.id === this.selectedRoleId);
            return selectedRole ? selectedRole.name : 'Select Role';
         }
      }
   },
   components: {
      Snackbar
   },
   methods: {
      addUser: async function () { // Mark the function as async
         if (!this.isInvalidData) {
            await postData("addUser", { log_id: getAccount().value, id: this.wId, name: this.uName, role: this.selectedRoleId })
               .then((response) => {
                  console.log(response.success != null);
                  if (response.success != null) {
                     this.wId = '';
                     this.uName = '';
                     this.selectedRoleId = null;
                     this.$refs.snackbarRef.show('The user has been added', 'success', 3000);

                  }
                  else {
                     this.$refs.snackbarRef.show('Error adding user', 'error', 3000);
                  }
               })
               .catch((error) => {
                  this.$refs.snackbarRef.show('Error adding user', 'error', 3000);
               });
         }
      }
   },

};

</script>