<template>

    <div class="app-header">
        <h2 class="page-head">QA Requests</h2>

    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Trans ID</th>
                <th>Product Name</th>
                <th>Batch ID</th>
                <th>Reward 🎉 (ETH)</th>
                <th>Status</th>
                <th>Logtime</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="request in requests" :key="request.trans_id">
                <td>{{ truncateTransId(request.trans_id) }}</td>
                <td>{{ request.product_info.name }}</td>
                <td>{{ request.product_info.batch_id }}</td>
                <td>{{ request.reward }}</td>

                <td>
                    <button @click="" :class="getStatusColorClass(request.status_info.status_id)">{{
                        request.status_info.status_name }}</button>
                </td>
                <td>{{ request.logtime }}</td>

                <td>
                    <template v-if="request.status === 1">
                        <button @click="acceptRequest(request.trans_id)" class="delivered">Accept</button>
                    </template>
                    <template v-else-if="request.status === 2 && request.qa === getAccount().value">
                        <button @click="showDialog(request.trans_id)" class="activate-button">Complete</button>
                    </template>

                    <template v-else>

                    </template>
                </td>
            </tr>
        </tbody>
        <TableEmpty :length="requests.length" colms="7" :isLoading="isLoading"></TableEmpty>

    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="requests.length < pageSize">Next Page</button>

    </div>

    <v-dialog v-model="isDialogVisible" max-width="500">
        <v-card color="#34495e">
            <v-card-title>
                QA Process Result 📃
            </v-card-title>
            <v-card-text>
                <div class="radio-container">
                    <label>
                        <input type="radio" v-model="selectedResult" value="pass">
                        Pass
                    </label>
                    <label>
                        <input type="radio" v-model="selectedResult" value="fail">
                        Fail
                    </label>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="#f39c12" @click="completeRequest">Send</v-btn>
                <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Snackbar ref="snackbarRef" />
    <AppLoading :isLoading="isLoading"></AppLoading>

</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { QaManagementABI, qaContractAddress } from '@/contracts/QaManagementABI.js';
import Web3 from 'web3'; // Import Web3 library
import AppLoading from "../components/DashboardPage/AppLoading.vue";
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";

export default {
    setup() {
        const snackbarRef = ref(null);
        const requests = ref([]);
        let currentPage = ref(1);
        const isDialogVisible = ref(false);
        const selectedResult = ref(null); // Default value for Pass
        const selectedRequest = ref(null);
        const showDialog = (val1) => {
            isDialogVisible.value = true;
            selectedRequest.value = val1;
        };

        const closeDialog = () => {
            isDialogVisible.value = false;
            selectedResult.value = null;
            selectedRequest.value = null;
        };
        const isLoading = ref(false);

        const fetchData = async () => {
            getData(`getQARequests?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`,
                () => {
                    isLoading.value = true;
                },
                () => {
                    isLoading.value = false;
                })
                .then((response) => {
                    requests.value = response.requests || [];
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

        fetchData();
        const getStatusColorClass = (status) => {
            switch (status) {
                case 1:
                    return 'default-status';
                case 2:
                    return 'packaging';
                case 3:
                    return 'delivered';
                case 4:
                    return 'out-of-stock';
                default:
                    return 'default-status';
            }
        };

        const acceptRequest = async (trans_id) => {
            const request = requests.value.find(r => r.trans_id === trans_id);
            const web3 = new Web3(window.ethereum);
            const contractAddress = qaContractAddress;
            const contract = new web3.eth.Contract(QaManagementABI, contractAddress);

            try {

                const tx = await contract.methods.acceptQARequest(
                    request.item_count,
                    web3.utils.toChecksumAddress(getAccount().value)
                ).send({ from: getAccount().value});
                const trans_id = tx['transactionHash'];
                set_balance();

                await postData("acceptQaRequest", {
                    log_id: getAccount().value,
                    request_id: request.trans_id,
                    product_id: request.product,
                    trans_id: trans_id
                },
                    () => {
                        isLoading.value = true;
                    },
                    () => {
                        isLoading.value = false;
                    }).then((response) => {

                    if (response.success != null) {
                        closeDialog();
                        snackbarRef.value.show('The request has been accepted', 'success', 3000);
                        fetchData();
                    }
                    else {

                        snackbarRef.value.show('Error accepting request', 'error', 3000);
                    }
                })
                    .catch((error) => {
                        console.log(error);

                        snackbarRef.value.show('Error accepting request', 'error', 3000);
                    });


            } catch (error) {
                console.error(error);
                snackbarRef.value.show('Error accepting request', 'error', 3000);
            }

        };


        const completeRequest = async () => {

            if (selectedResult.value === null) {
                snackbarRef.value.show('Please select the QA Result', 'error', 3000);

            }

            else if (selectedRequest.value === null) {
                snackbarRef.value.show('Error completing request', 'error', 3000);

            }

            else {
                const request = requests.value.find(r => r.trans_id === selectedRequest.value);
                const web3 = new Web3(window.ethereum);
                const contractAddress = qaContractAddress;
                const contract = new web3.eth.Contract(QaManagementABI, contractAddress);
                
                try {
                    const res = selectedResult.value === 'pass' ? 1 : 3;

                    const tx = await contract.methods.completeQARequest(
                        request.item_count,
                        res
                    ).send({ from: getAccount().value });
                    const trans_id = tx['transactionHash'];
                    set_balance();

                    await postData("completeQaRequest", {
                        log_id: getAccount().value,
                        request_id: request.trans_id,
                        product_id: request.product,
                        trans_id: trans_id,
                        product_status: res
                    },
                        () => {
                            isLoading.value = true;
                        },
                        () => {
                            isLoading.value = false;
                        }).then((response) => {

                        if (response.success != null) {
                            closeDialog();
                            snackbarRef.value.show('The request has been completed', 'success', 3000);
                            fetchData();
                        }
                        else {

                            snackbarRef.value.show('Error completing request', 'error', 3000);
                        }
                    })
                        .catch((error) => {
                            console.log(error);

                            snackbarRef.value.show('Error completing request', 'error', 3000);
                        });


                } catch (error) {
                    console.error(error);
                    snackbarRef.value.show('Error completing request', 'error', 3000);
                }
            }

        };


        onMounted(() => {
            snackbarRef.value = snackbarRef;
        });

        return {
            requests,
            isDialogVisible,
            showDialog,
            closeDialog,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            selectedResult,
            getStatusColorClass,
            getAccount,
            acceptRequest,
            completeRequest,
            snackbarRef,
            isLoading
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
        Snackbar,
        TableEmpty,
        AppLoading
    },
};
</script>
