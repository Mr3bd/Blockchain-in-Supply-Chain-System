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
                <th>Price</th>
                <th>Quantity</th>
                <th>Logtime</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product.id">
                <td>{{ truncateTransId(product.trans_id) }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ product.logtime }}</td>
            </tr>
        </tbody>
    </table>
    <div class="pn-buttons-container">
        <button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
        <button class='prev-next-btn' @click="nextPage" :disabled="products.length < 10">Next Page</button>

    </div>

</template>


<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import router from "@/router.js"; // Import the Vue Router instance
import { getData } from "@/apiService.js";
export default {
    setup() {
        const products = ref([]);
        let currentPage = ref(1);
        const pageSize = 10; // Change this according to your page size

        const fetchData = async () => {
            getData(`getProducts?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
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
        const goToAddProductPage = () => {
            router.push("/dashboard/addproduct");
        };
        fetchData(); // Fetch data on component mount

        return {
            products,
            nextPage,
            previousPage,
            currentPage,
            pageSize,
            goToAddProductPage
        };
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
