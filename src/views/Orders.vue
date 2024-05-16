<template>

    <div class="app-header">
        <h2 class="page-head">Orders</h2>

    </div>
    <table class="app-table">
        <thead>
            <tr>
                <th>Trans ID</th>
                <th>Requester ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Shipment Id</th>
                <th>Logtime</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order.id">
                <td>{{ truncateTransId(order.trans_id) }}</td>
                <td>{{ truncateTransId(order.requester_info.requester_id) }}</td>
                <td>{{ order.product_info.product_name }}</td>
                <td>{{ order.quantity }}x</td>
                <td>


                    <template v-if="order.owner === getAccount().value && order.status === 11">
                        <button @click="showDialog(order, true)"
                            :class="getStatusColorClass(order.status_info.status_id)">{{
                            order.status_info.status_name }}</button>

                    </template>
                    <template v-else>
                        <button @click="" :class="getStatusColorClass(order.status_info.status_id)">{{
                            order.status_info.status_name }}</button>
                    </template>


                </td>
                <td>
                    <template v-if="order.shipment_id === null">
                        N/A
                    </template>

                    <template v-else>
                        {{ order.shipment_id }}
                    </template>

                </td>

                <td>{{ order.logtime }}</td>

                <td>
                    <template v-if="getAccount().value === order.product_info.product_owner && order.status === 5">
                        <button @click="completePackaging(order)" class="activate-button">Complete Packaging</button>
                    </template>

                    <template v-else-if="getAccount().value === order.owner && order.status === 10">
                        <button @click="showDialog(order, false)" class="default-status">Request Shipment</button>
                    </template>

                    <template v-else>
                    </template>

                </td>
            </tr>
        </tbody>
        <TableEmpty :length="orders.length" colms="8" :isLoading="isLoading"></TableEmpty>

    </table>



    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="orders.length < pageSize">Next Page</button>

    </div>


    <v-dialog v-model="isDialogVisible" max-width="500">
        <template v-if="cancelMode">
            <v-card color="#34495e">
                <v-card-title>
                    Do you want to cancel<br>the Shipment Request?
                </v-card-title>

                <v-card-text>
                    You have provided a reward of: {{ shipReqData.reward }} ETH, which will be returned to you.
                </v-card-text>

                <v-card-actions>
                    <v-btn color="#f39c12" @click="cancelShippingRequest">Cancel Request</v-btn>
                    <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <template v-else>
            <v-card color="#34495e">
                <v-card-title>
                    Request Shipping
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-card-subtitle style="margin-bottom: 8px;">Enter amount of reward 🎉</v-card-subtitle>
                        <v-text-field v-model="shipReqDto.reward" label="Reward (ETH)" type="number"></v-text-field>

                        <v-card-subtitle style="margin-bottom: 8px;">Address</v-card-subtitle>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model="shipReqDto.country" label="Country"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="shipReqDto.city" label="City"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="shipReqDto.street" label="Street"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="shipReqDto.zipcode" label="ZIP Code"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="shipReqDto.building" label="Building"></v-text-field>
                            </v-col>
                        </v-row>

                    </v-container>

                </v-card-text>

                <v-card-actions>
                    <v-btn color="#00a36c" @click="addShippingRequest">Send</v-btn>
                    <v-btn color="#ff1818" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <AppLoading :isLoading="isLoading"></AppLoading>
    <Snackbar ref="snackbarRef" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import { getData, postData, pageSize } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';
import { OrderManagementABI, orderContractAddress } from '@/contracts/OrderManagementABI.js';
import { ShippingManagementABI, shippingContractAddress } from '@/contracts/ShippingManagementABI.js';
import Web3 from 'web3';
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";
import AppLoading from "../components/DashboardPage/AppLoading.vue";

export default {
    setup() {
        const web3 = new Web3(window.ethereum);
        const snackbarRef = ref(null);
        const orders = ref([]);
        let currentPage = ref(1);
        const cancelMode = ref(false);
        const selected_order = ref(null);
        const isDialogVisible = ref(false);
        const isLoading = ref(false);

        const shipReqDto = ref(
            {
                order_id: '',
                trans_id: '',
                reward: 0,
                country: '',
                city: '',
                street: '',
                zipcode: '',
                building: ''
            }
        );
        const shipReqData = ref({
            order_id: '',
            trans_id: '',
            reward: 0
        });
        const showDialog = (order_val, isCancel) => {
            cancelMode.value = false;
            shipReqDto.value = {
                order_id: '',
                trans_id: '',
                reward: 0,
                country: '',
                city: '',
                street: '',
                zipcode: '',
                building: ''
            };
            shipReqData.value = {
                order_id: '',
                trans_id: '',
                reward: 0
            };
            isDialogVisible.value = true;
            selected_order.value = order_val;
            cancelMode.value = isCancel;
            if (isCancel) {
                getShippingRequest();
            }
        };

        const closeDialog = () => {
            isDialogVisible.value = false;
            fetchData();
        };

        const fetchData = async () => {
            getData(`getOrders?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`,
                () => {
                    isLoading.value = true;
                },
                () => {
                    isLoading.value = false;
                })
                .then((response) => {
                    orders.value = response.orders || [];

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
                case 7:
                    return 'activate-button';
                case 10:
                    return 'packaging';
                default:
                    return 'default-status';
            }
        };

        const completePackaging = async (order) => {
            if (order.status === 5) {
                const contractAddress = orderContractAddress;
                const contract = new web3.eth.Contract(OrderManagementABI, contractAddress);

                try {
                    const tx = await contract.methods.changeOrderStatus(
                        order.item_count,
                        10
                    ).send({ from: getAccount().value });
                    const trans_id = tx['transactionHash'];
                    set_balance();
                    await postData("sendOrderForShipping", {
                        log_id: getAccount().value,
                        order_id: order.trans_id,
                        trans_id: trans_id
                    },
                        () => {
                            // showLoading function
                            isLoading.value = true;
                        },
                        () => {
                            // hideLoading function
                            isLoading.value = false;
                        }).then((response) => {
                        if (response.success != null) {
                            fetchData();
                            snackbarRef.value.show('Successfully', 'success', 3000);
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
            else {
                snackbarRef.value.show('Order not in Packaging Stage', 'error', 3000);
            }

        };


        const addShippingRequest = async () => {
            if (shipReqDto.value.reward <= 0) {
                snackbarRef.value.show('Please enter positive reward value', 'error', 3000);
                return;
            }

            else if (shipReqDto.value.country == '') {
                snackbarRef.value.show('Please the country', 'error', 3000);
                return;
            }
            else if (shipReqDto.value.city == '') {
                snackbarRef.value.show('Please the city', 'error', 3000);
                return;
            }
            else if (shipReqDto.value.street == '') {
                snackbarRef.value.show('Please the street', 'error', 3000);
                return;
            }
            else if (shipReqDto.value.zipcode == '') {
                snackbarRef.value.show('Please your ZIP code', 'error', 3000);
                return;
            }
            else if (shipReqDto.value.building == '') {
                snackbarRef.value.show('Please the building', 'error', 3000);
                return;
            }

            else if (selected_order.value.trans_id == null || selected_order.value.item_count == null) {
                snackbarRef.value.show('Please select valid order', 'error', 3000);

            }

            else {

                const contractAddress = shippingContractAddress;
                const contract = new web3.eth.Contract(ShippingManagementABI, contractAddress);
                const rewardInEther = web3.utils.toWei((shipReqDto.value.reward).toString(), 'ether');
                try {
                    const tx = await contract.methods.addShippingRequest(
                        selected_order.value.item_count,
                        rewardInEther,
                        shipReqDto.value.country,
                        shipReqDto.value.city,
                        shipReqDto.value.street,
                        shipReqDto.value.zipcode,
                        shipReqDto.value.building,
                    ).send({ from: getAccount().value, value: rewardInEther });
                    console.log(tx);
                    const trans_id = tx['transactionHash'];
                    const reqId = tx.events.ShippingRequestAdded.returnValues.reqId.toString();
                    set_balance();
                    await postData("createShippingRequest", {
                        log_id: getAccount().value,
                        trans_id: trans_id,
                        order_id: selected_order.value.trans_id,
                        reward: shipReqDto.value.reward,
                        item_count: reqId,
                        country: shipReqDto.value.country,
                        city: shipReqDto.value.city,
                        street: shipReqDto.value.street,
                        zipcode: shipReqDto.value.zipcode,
                        building: shipReqDto.value.building,
                    },
                        () => {
                            // showLoading function
                            isLoading.value = true;
                        },
                        () => {
                            // hideLoading function
                            isLoading.value = false;
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


        const cancelShippingRequest = async () => {
            const contractAddress = shippingContractAddress;
            const contract = new web3.eth.Contract(ShippingManagementABI, contractAddress);
            try {
                tx = await contract.methods.cancelshippingRequest(
                    shipReqData.value.item_count
                ).send({ from: getAccount().value });
                const trans_id = tx['transactionHash'];
                set_balance();
                await postData("cancelShippingRequest", {
                    log_id: getAccount().value,
                    request_id: shipReqData.value.trans_id,
                    trans_id: trans_id
                },
                    () => {
                        // showLoading function
                        isLoading.value = true;
                    },
                    () => {
                        // hideLoading function
                        isLoading.value = false;
                    }).then((response) => {

                    if (response.success != null) {
                        closeDialog();
                        snackbarRef.value.show('The request has been canceled', 'success', 3000);
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
        const getShippingRequest = async () => {
            getData(`getShippingRequest?log_id=${getAccount().value}&order_id=${selected_order.value.trans_id}&status=1`,
                () => {
                    // showLoading function
                    isLoading.value = true;
                },
                () => {
                    // hideLoading function
                    isLoading.value = false;
                })
                .then((response) => {
                    console.log(response);
                    shipReqData.value = response.request_data;
                })
                .catch((error) => {
                    console.error("Error while making Get request:", error);
                });
        };


        onMounted(() => {
            snackbarRef.value = snackbarRef;
        });

        return {
            orders,
            showDialog,
            closeDialog,
            isLoading,
            nextPage,
            cancelMode,
            shipReqData,
            shipReqDto,
            previousPage,
            currentPage,
            pageSize,
            isDialogVisible,
            selected_order,
            getStatusColorClass,
            getAccount,
            snackbarRef,
            completePackaging,
            addShippingRequest,
            cancelShippingRequest,
            

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
