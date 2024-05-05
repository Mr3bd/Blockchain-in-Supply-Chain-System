<template>

    <div class="app-header">
        <h2 class="page-head">Shipping Requests</h2>

    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Trans ID</th>
                <th>Product Name</th>
                <th>Shipment ID</th>
                <th>Reward 🎉 (ETH)</th>
                <th>Status</th>
                <th>Logtime</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="request in requests" :key="request.trans_id">
                <td>{{ truncateTransId(request.trans_id) }}</td>
                <td>{{ request.order_info.product_name }}</td>
                <td>
                    <template v-if="request.order_info.shipment_id === null">
                        N/A
                    </template>

                    <template v-else>
                        {{ request.order_info.shipment_id }}
                    </template>

                </td>
                <td>{{ request.reward }}</td>
                <td>
                    <button @click="" :class="getStatusColorClass(request.status_info.status_id)">{{
                        request.status_info.status_name }}</button>
                </td>
                <td>{{ request.logtime }}</td>
                <td>
                    <template v-if="request.status === 1">
                        <button @click="acceptRequest(request)" class="delivered">Accept</button>
                    </template>
                    <template v-else-if="request.status === 2 && request.lg === getAccount().value">
                        <button @click="completeRequest(request)" class="activate-button">Delivered</button>
                    </template>

                    <template v-else>
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="requests.length < pageSize">Next Page</button>

    </div>

    <Snackbar ref="snackbarRef" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { ShippingManagementABI, shippingContractAddress } from '@/contracts/ShippingManagementABI.js';
import Web3 from 'web3'; // Import Web3 library

export default {
    setup() {
        const snackbarRef = ref(null);
        const requests = ref([]);
        let currentPage = ref(1);
    
        const fetchData = async () => {
            getData(`getShippingRequests?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
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

        const acceptRequest = async (request) => {
            const web3 = new Web3(window.ethereum);
            const contractAddress = shippingContractAddress;
            const contract = new web3.eth.Contract(ShippingManagementABI, contractAddress);

            try {

                const tx = await contract.methods.acceptShippingRequest(
                    request.item_count,
                    web3.utils.toChecksumAddress(getAccount().value)
                ).send({ from: getAccount().value});
                const trans_id = tx['transactionHash'];
                set_balance();

                await postData("acceptShippingRequest", {
                    log_id: getAccount().value,
                    request_id: request.trans_id,
                    order_id: request.product_order,
                    trans_id: trans_id
                }).then((response) => {

                    if (response.success != null) {
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


        const completeRequest = async (request) => {
                const web3 = new Web3(window.ethereum);
                const contractAddress = shippingContractAddress;
                const contract = new web3.eth.Contract(ShippingManagementABI, contractAddress);
                
                try {
                    const tx = await contract.methods.completeShippingRequest(
                        request.item_count
                    ).send({ from: getAccount().value });
                    const trans_id = tx['transactionHash'];
                    set_balance();

                    await postData("completeShippingRequest", {
                        log_id: getAccount().value,
                        request_id: request.trans_id,
                        order_id: request.product_order,
                        trans_id: trans_id
                    }).then((response) => {

                        if (response.success != null) {
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
            

        };


        onMounted(() => {
            snackbarRef.value = snackbarRef;
        });

        return {
            requests,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            getStatusColorClass,
            getAccount,
            acceptRequest,
            completeRequest,
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
