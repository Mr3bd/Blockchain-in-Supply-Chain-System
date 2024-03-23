<template>

    <div class="app-header">
        <h1>Users</h1>
        <button @click="goToAddUserPage" class="add-button">
            <span class="material-icons">add</span>
            <span>Add</span>
        </button>
    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Id</th>
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
                <td>{{ user.role_info.role_name }}</td>
                <td>
                    <template v-if="user.id === getAccount().value">
                        <span>-</span>
                    </template>
                    <template v-else-if="user.deleted === 0">
                        <button @click="deleteUser(user.id)" class="delete-button">Delete</button>
                    </template>
                    <template v-else>
                        <button @click="activateUser(user.id)" class="activate-button">Activate</button>
                    </template>
                </td>
                <td>{{ user.logtime }}</td>
            </tr>
        </tbody>
    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="users.length < 10">Next Page</button>

    </div>
    <Snackbar ref="snackbarRef" />
</template>

<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import router from "@/router.js"; // Import the Vue Router instance
import { getData, postData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';

export default {
    setup() {
        const users = ref([]);
        let currentPage = ref(1);
        const pageSize = 10; // Change this according to your page size

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
                    this.$refs.snackbarRef.show('The user has been deleted', 'success', 3000);

                    fetchData();
                })
                .catch((error) => {
                    this.$refs.snackbarRef.show('Something went wrong', 'success', 3000);

                    console.error(response);

                });
        };
        const activateUser = (uId) => {
            postData("activateUser", { log_id: getAccount().value, id: uId })
                .then((response) => {
                    this.$refs.snackbarRef.show('The user has been activated', 'success', 3000);
                    fetchData();
                })
                .catch((error) => {
                    this.$refs.snackbarRef.show('Something went wrong', 'success', 3000);

                });

        };
        fetchData(); // Fetch data on component mount

        return {
            users,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            goToAddUserPage,
            deleteUser,
            activateUser,
            getAccount,
        };
    },
    components: {
        Snackbar
    },
    data() {
        return {
            truncateTransId: function (transId) {
                return transId.slice(0, 24) + '...';
            }
        };
    }
};
</script>

<style>
.delete-button {
    background-color: #ff181836;
    color: #ff1818;
    border-radius: 5px;
}

.activate-button {
    background-color: #00a36c36;
    color: #00a36c;
    border-radius: 5px;
}
</style>