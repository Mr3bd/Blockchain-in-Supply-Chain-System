<template>
    <div class="app-header">
        <h2 class="page-head">Users</h2>
        <button @click="goToAddUserPage" class="add-button">
            <span class="material-icons">add</span>
            <span>Add</span>
        </button>
    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Wallet Id</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Logtime</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>
                    <template v-if="user.id === getAccount().value">

                    </template>

                    <template v-else>
                        <button @click="openRoleSelection(user)" class="role-button">{{ user.role_info.role_name
                            }}</button>
                    </template>
                </td>

                <td>
                    <template v-if="user.id === getAccount().value">

                    </template>
                    <template v-else-if="user.deleted === 0">
                        <button @click="deleteUser(user.id)" class="delete-button">Disable</button>
                    </template>
                    <template v-else>
                        <button @click="activateUser(user.id)" class="activate-button">Activate</button>
                    </template>
                </td>
                <td>{{ user.logtime }}</td>
            </tr>
        </tbody>
        <TableEmpty :length="users.length" colms="5"></TableEmpty>

    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="users.length < pageSize">Next Page</button>

    </div>
    <Snackbar ref="snackbarRef" />
    <v-bottom-sheet v-model="showRoleSelectionRef">
        <v-list style="background-color: #f4f7fa; ">
            <v-list-item v-for="role in roles" :key="role.id" @click="selectRole(role.id)">
                <v-list-item-title style="display: flex; align-items: center; color: #2C3E50; margin: 12px;">
                    {{ role.name }}
                    <span v-if="role.id === selectedRoleId" class="material-icons"
                        style="margin-left: 8px; color: #00a36c;">check</span>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-bottom-sheet>

    <!-- <RoleSelection v-if="showRoleSelection" :roles="roles" :selectedRoleId="selectedRoleId" @roleSelected="selectRole"
        @close="showRoleSelection = false" />

    <BottomSheetTemp>
    </BottomSheetTemp> -->
</template>
<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js";
import router from "@/router.js";
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { reactive } from 'vue';
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";

export default {
    setup() {
        const users = ref([]);
        const currentPage = ref(1);
        const snackbarRef = ref(null);
        const roles = ref([]);
        const selectedUser = reactive({}); // To keep track of the selected user
        const selectedRoleId = ref(null);
        const showRoleSelectionRef = ref(false);

        const fetchData = async () => {
            getData(`getUsers?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
                .then((response) => {
                    users.value = response.users || [];
                })
                .catch((error) => {
                    console.error("Error while making Get request:", error);
                });
        };

        const nextPage = () => {
            currentPage.value++;
            fetchData();
        };

        const previousPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchData();
            }
        };

        const goToAddUserPage = () => {
            router.push("/dashboard/adduser");
        };

        const deleteUser = (uId) => {
            postData("deleteUser", { log_id: getAccount().value, id: uId })
                .then((response) => {
                    snackbarRef.value.show('The user has been deleted', 'success', 3000);
                    fetchData();
                })
                .catch((error) => {
                    snackbarRef.value.show('Something went wrong', 'error', 3000);
                    console.error(error);
                });
        };

        const activateUser = (uId) => {
            postData("activateUser", { log_id: getAccount().value, id: uId })
                .then((response) => {
                    snackbarRef.value.show('The user has been activated', 'success', 3000);
                    fetchData();
                })
                .catch((error) => {
                    snackbarRef.value.show('Something went wrong', 'error', 3000);
                    console.error(error);
                });
        };

        const openRoleSelection = async (user) => {
            selectedUser.value = user;
            selectedRoleId.value = selectedUser.value.role_info.role_id;
            getData(`rolesLookUp?page=1&pageSize=100`)
                .then((response) => {
                    roles.value = response.roles || [];
                    showRoleSelectionRef.value = true;
                })
                .catch((error) => {
                    console.error('Error fetching roles:', error);
                });

        };

        const selectRole = async (roleId) => {
            selectedUser.value.role_info.role_id = roleId; // Update user's role ID
            postData("changeUserRole", { log_id: getAccount().value, id: selectedUser.value.id, role_id: roleId })
                .then((response) => {
                    showRoleSelectionRef.value = false; // Hide role selection component
                    snackbarRef.value.show('Role updated successfully', 'success', 3000);
                    fetchData();
                })
                .catch((error) => {
                    showRoleSelectionRef.value = false;
                    snackbarRef.value.show('Error updating role', 'error', 3000);
                    console.error(error);
                });
        };

        fetchData();

        return {
            users,
            currentPage,
            pageSize,
            snackbarRef,
            roles,
            selectedUser,
            selectedRoleId,
            showRoleSelectionRef,
            nextPage,
            previousPage,
            goToAddUserPage,
            deleteUser,
            activateUser,
            getAccount,
            selectRole,
            openRoleSelection,
            
        };
    },
    components: {
        Snackbar,
        TableEmpty
    }
};
</script>

