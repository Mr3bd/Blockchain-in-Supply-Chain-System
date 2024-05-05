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
                    <template
                        v-if="product.owner === getAccount().value && (product.status === 4 || product.status === 3)">
                        <button @click="showDialog(product.product_id, product.trans_id, false)"
                            class="default-status">Request Review</button>
                    </template>
                    <template v-else>
                   
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
        <template v-if="cancelMode">
            <v-card color="#34495e">
                <v-card-title>
                    Do you want to cancel the QA Request?
                </v-card-title>

                <v-card-text>
                    You have provided a reward of: {{ qaReqData.reward }} ETH, which will be returned to you.
                </v-card-text>

                <v-card-actions>
                    <v-btn color="#f39c12" @click="cancelQaRequest">Cancel Request</v-btn>
                    <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <template v-else>
            <v-card color="#34495e">
                <v-card-title>
                    Enter amount of reward 🎉
                </v-card-title>

                <v-card-text>
                    <v-text-field v-model="reward" label="Reward (ETH)" type="number"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="#f39c12" @click="addQaTask">Send</v-btn>
                    <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    
    <Snackbar ref="snackbarRef" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import router from "@/router.js"; // Import the Vue Router instance
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { QaManagementABI, qaContractAddress } from '@/contracts/QaManagementABI.js';
import Web3 from 'web3'; // Import Web3 library

export default {
    setup() {
        const snackbarRef = ref(null);
        const products = ref([]);
        let currentPage = ref(1);
        const isDialogVisible = ref(false);
        const cancelMode = ref(false);
        const reward = ref(null);
        const web3 = new Web3(window.ethereum);
        const qaReqData = ref({
            product_id: '',
            trans_id: '',
            reward: 0
        });
        const selected_product = ref({
            product_id: '',
            trans_id: '',
            reward: 0
        });
        const showDialog = (val1, val2, isCancel) => {
            isDialogVisible.value = true;
            selected_product.value.product_id = val1;
            selected_product.value.trans_id = val2;
            cancelMode.value = isCancel;
            if (isCancel) {
                getQaRequest();
            }
        };

        const closeDialog = () => {
            isDialogVisible.value = false;
            fetchData();
            selected_product.value.product_id = '';
            selected_product.value.trans_id = '';
            cancelMode.value = false;
            qaReqData.value = {
                product_id: '',
                trans_id: '',
                reward: 0
            };
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

        const getQaRequest = async () => {
            getData(`getQaRequest?log_id=${getAccount().value}&product_id=${selected_product.value.trans_id}&status=1`)
                .then((response) => {
                    qaReqData.value = response.request_data;
                    console.log(qaReqData.value);
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
                case 9:
                    return 'wait-review';
                default:
                    return 'default-status';
            }
        };

        const addQaTask = async () => {
            if (reward.value <= 0) {
                snackbarRef.value.show('Please enter positive reward value', 'error', 3000);
                return;
            }


            if (selected_product.value.product_id == null || selected_product.value.trans_id == null) {
                snackbarRef.value.show('Please select valid product', 'error', 3000);

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


        const cancelQaRequest = async () => {
            const contractAddress = qaContractAddress;
            const contract = new web3.eth.Contract(QaManagementABI, contractAddress);
            try {
                await contract.methods.cancelQARequest(
                    qaReqData.value.item_count
                ).send({ from: getAccount().value });

                set_balance();
                await postData("cancelQaRequest", {
                    log_id: getAccount().value,
                    request_id: qaReqData.value.trans_id
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


        };


        onMounted(() => {
            snackbarRef.value = snackbarRef;
        });

        return {
            products,
            isDialogVisible,
            cancelMode,
            reward,
            showDialog,
            closeDialog,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            qaReqData,
            goToAddProductPage,
            getStatusColorClass,
            getAccount,
            addQaTask,
            cancelQaRequest,
            snackbarRef
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
