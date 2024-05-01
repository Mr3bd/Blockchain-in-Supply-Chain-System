<template>

    <div class="app-header">
        <h2 class="page-head">Products</h2>
        <button @click="goToAddProductPage" class="add-button">
            <span class="material-icons">add</span>
            <span>Add</span>
        </button>
    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Trans ID</th>
                <th>Name</th>
                <th>Price (ETH)</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Owner</th>
                <th>Logtime</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product.id">
                <td>{{ truncateTransId(product.trans_id) }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>
                    <button @click="" :class="getStatusColorClass(product.status_info.status_id)">{{
                        product.status_info.status_name }}</button>
                </td>
                <td>{{ product.quantity }}x</td>
                <td :title="product.owner_info.owner_id">{{ product.owner_info.owner_name }}</td>
                <td>{{ product.logtime }}</td>

                <td>
                    <template v-if="product.owner === getAccount().value && product.status === 4">
                        <button @click="showDialog" class="default-status">Request Review</button>
                    </template>
                    <template v-else>
                        <span>-</span>
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="products.length < 10">Next Page</button>

    </div>

    <v-dialog v-model="isDialogVisible" max-width="500">
        <v-card color="#34495e">
            <v-card-title>
                Enter amount of reward 🎉
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="reward" label="Reward (ETH)" type="number"></v-text-field>
                <h3 style="margin-top: 4px; margin-bottom: 8px; ">Task Executor</h3>
                <select v-model="selected_user">
                    <option value="">Select User</option>
                    <option v-for="qaUser in qaUsers" :key="qaUser.id" :value="qaUser.id">
                        {{ qaUser.name }}
                    </option>
                </select>
            </v-card-text>

            <v-card-actions>
                <v-btn color="#f39c12" @click="addQaTask">Send</v-btn>
                <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Snackbar ref="snackbarRef" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import router from "@/router.js"; // Import the Vue Router instance
import { getData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';

export default {
    setup() {
        const snackbarRef = ref(null);
        const products = ref([]);
        let currentPage = ref(1);
        const pageSize = 10; // Change this according to your page size
        const isDialogVisible = ref(false);
        const reward = ref(null);
        const showDialog = () => {
            isDialogVisible.value = true;
            getQaUsers();
        };
        const qaUsers = ref([]);
        const selected_user = ref('')

        const closeDialog = () => {
            isDialogVisible.value = false;
        };
        const fetchData = async () => {
            getData(`getProducts?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
                .then((response) => {
                    products.value = response.products || [];
                })
                .catch((error) => {
                    console.error("Error while making Get request:", error);
                });
        };

        const getQaUsers = async () => {
            getData(`getUsersByFilter?log_id=${getAccount().value}&role_id=4`)
                .then((response) => {
                    qaUsers.value = response.users || [];
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
        const goToAddProductPage = () => {
            router.push("/dashboard/addproduct");
        };
        fetchData(); // Fetch data on component mount
        const getStatusColorClass = (status) => {
            switch (status) {
                case 1:
                    return 'in-stock';
                case 2:
                    return 'out-of-stock';
                case 3:
                    return 'qa-issue';
                case 4:
                    return 'in-production';
                case 5:
                    return 'packaging';
                case 6:
                    return 'out-for-delivery';
                case 7:
                    return 'delivered';
                case 8:
                    return 'in-review';
                default:
                    return 'default-status';
            }
        };

        const addQaTask = async () => {
            if (reward.value <= 0) {
                snackbarRef.value.show('Please enter positive reward value', 'error', 3000);

                return;
            }

            if (selected_user.value === '') {
                snackbarRef.value.show('Please select user for this task', 'error', 3000);

                return;
            }


            // await postData("addProduct", {
            //     log_id: getAccount().value,
            //     trans_id: trans_id,
            //     product_id: productId,
            //     name: product.value.name,
            //     quantity: product.value.quantity,
            //     price: product.value.price,
            //     material_ids: JSON.stringify(materials_json)
            // }).then((response) => {

            //     if (response.success != null) {
            //         console.log('success django');
            //         materialBlocks.value = [];
            //         materials.value = [];
            //         product.value = {
            //             name: '',
            //             quantity: 0,
            //             price: 0,
            //         };
            //         snackbarRef.value.show('The product has been added', 'success', 3000);
            //     }
            //     else {
            //         console.log('failed django');

            //         snackbarRef.value.show('Error adding product', 'error', 3000);
            //     }
            // })
            //     .catch((error) => {
            //         console.log(error);

            //         snackbarRef.value.show('Error adding product', 'error', 3000);
            //     });
        };

        onMounted(() => {
            // Ensure that snackbarRef is populated after the component is mounted
            snackbarRef.value = snackbarRef;
        });

        return {
            products,
            isDialogVisible,
            reward,
            qaUsers,
            selected_user,
            showDialog,
            closeDialog,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            goToAddProductPage,
            getStatusColorClass,
            getAccount,
            addQaTask,
            snackbarRef
        };
    },
    data() {
        return {
            truncateTransId: function (transId) {
                return transId.slice(0, 16) + '...';
            }
        };
    },
    components: {
        Snackbar
    },
};
</script>
