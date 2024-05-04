<template>

    <div class="app-header">
        <h2 class="page-head">Store</h2>

    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Trans ID</th>
                <th>Batch ID</th>
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
                <td>{{ product.batch_id }}</td>

                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>

                    <template v-if="product.owner === getAccount().value && product.status === 9">
                        <button @click="showDialog(product.product_id, product.trans_id, true)"
                            :class="getStatusColorClass(product.status_info.status_id)">{{
                product.status_info.status_name }}</button>
                    </template>
                    <template v-else>
                        <button @click="" :class="getStatusColorClass(product.status_info.status_id)">{{
                product.status_info.status_name }}</button>
                    </template>


                </td>
                <td>{{ product.quantity }}x</td>
                <td :title="product.owner_info.owner_id">{{ product.owner_info.owner_name }}</td>
                <td>{{ product.logtime }}</td>

                <td>
                    <template v-if="product.quantity > 0">
                        <button @click="showDialog(product)" class="packaging">Order Now</button>
                    </template>

                </td>
            </tr>
        </tbody>
    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="products.length < pageSize">Next Page</button>

    </div>


    <v-dialog v-model="isDialogVisible" max-width="500">
        <v-card color="#34495e">
            <v-card-title>
                <div v-if="selected_product != null">
                    Order: {{ selected_product.name }}
                </div>


            </v-card-title>
            <v-card-text>
                Select the quantity
                <v-text-field v-model="quantity" label="Quantity" type="number" style="margin-top: 10px"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="#00a36c" @click="createOrder">Order</v-btn>
                <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <Snackbar ref="snackbarRef" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { QaManagementABI, qaContractAddress } from '@/contracts/QaManagementABI.js';
import Web3 from 'web3';

export default {
    setup() {
        const web3 = new Web3(window.ethereum);
        const snackbarRef = ref(null);
        const products = ref([]);
        let currentPage = ref(1);
        const selected_product = ref(null);
        const isDialogVisible = ref(false);
        const quantity = ref(null);
        const showDialog = (product_val) => {
            isDialogVisible.value = true;
            selected_product.value = product_val;
        };

        const closeDialog = () => {
            isDialogVisible.value = false;
            selected_product.value = null;
            quantity.value = null;
        };

        const fetchData = async () => {
            getData(`getStoreProducts?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
                .then((response) => {
                    products.value = response.products || [];
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

        fetchData(); // Fetch data on component mount
        const getStatusColorClass = (status) => {
            switch (status) {
                case 1:
                    return 'in-stock';
                case 2:
                    return 'out-of-stock';
                default:
                    return 'default-status';
            }
        };

        const createOrder = async () => {

            if (selected_product.value.product_id == null || selected_product.value.trans_id == null) {
                snackbarRef.value.show('Please select valid product', 'error', 3000);

            }

            if(quantity.value == null)
            {
                snackbarRef.value.show('Please enter valid quantity', 'error', 3000);

            }

            else if (quantity.value > selected_product.value.quantity || quantity.value <= 0) {
                snackbarRef.value.show('Please enter valid quantity', 'error', 3000);

            }

            else {

                const contractAddress = qaContractAddress;
                const contract = new web3.eth.Contract(QaManagementABI, contractAddress);
                const rewardInEther = web3.utils.toWei((reward.value).toString(), 'ether');
                try {
                    console.log(selected_product.value.product_id);
                    const tx = await contract.methods.addQARequest(
                        selected_product.value.product_id,
                        rewardInEther
                    ).send({ from: getAccount().value, value: rewardInEther });
                    console.log(tx);
                    const trans_id = tx['transactionHash'];
                    const reqId = tx.events.QARequestAdded.returnValues.reqId.toString();
                    set_balance();
                    await postData("createQaRequest", {
                        log_id: getAccount().value,
                        trans_id: trans_id,
                        product_id: selected_product.value.trans_id,
                        reward: reward.value,
                        item_count: reqId,
                    }).then((response) => {

                        if (response.success != null) {
                            closeDialog();
                            snackbarRef.value.show('The request has been sent', 'success', 3000);
                        }
                        else {

                            snackbarRef.value.show('Error sending request', 'error', 3000);
                        }
                    })
                        .catch((error) => {
                            console.log(error);

                            snackbarRef.value.show('Error sending request', 'error', 3000);
                        });


                } catch (error) {
                    console.error(error);
                    snackbarRef.value.show('Error sending request', 'error', 3000);
                }
            }
        };

        onMounted(() => {
            snackbarRef.value = snackbarRef;
        });

        return {
            products,
            showDialog,
            closeDialog,
            nextPage,
            previousPage,
            currentPage,
            quantity,
            pageSize,
            isDialogVisible,
            selected_product,
            getStatusColorClass,
            getAccount,
            snackbarRef,
            createOrder

        };
    },
    data() {
        return {
            truncateTransId: function (transId) {
                return transId.slice(0, 12) + '...';
            }
        };
    },
    components: {
        Snackbar
    },
};
</script>
