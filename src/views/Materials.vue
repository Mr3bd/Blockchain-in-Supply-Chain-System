<template>
	<div class="app-header">
		<h2 class="page-head">Materials</h2>
		<button @click="goToAddMaterialPage" class="add-button">
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
				<th>Quantity</th>
				<th>Logtime</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="material in materials" :key="material.id">
				<td>{{ truncateTransId(material.trans_id) }}</td>
				<td>{{ material.name }}</td>
				<td>{{ material.price }}</td>
				<td>{{ material.quantity }}x</td>
				<td>{{ material.logtime }}</td>
			</tr>

		</tbody>
		<TableEmpty :length="materials.length" colms="5" :isLoading="isLoading"></TableEmpty>

	</table>
	<div class="pn-buttons-container">
		<button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
		<button class='prev-next-btn' @click="nextPage" :disabled="materials.length < pageSize">Next Page</button>
	</div>
	<AppLoading :isLoading="isLoading"></AppLoading>

</template>

<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import router from "@/router.js"; // Import the Vue Router instance
import { getData, pageSize } from "@/apiService.js";
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";
import AppLoading from "../components/DashboardPage/AppLoading.vue";

export default {
	setup() {
		const materials = ref([]);
		let currentPage = ref(1);
		const isLoading = ref(false);

		const fetchData = async () => {
			getData(`getMaterials?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`,
				() => {
					isLoading.value = true;
				},
				() => {
					isLoading.value = false;
				}
			)
				.then((response) => {
					materials.value = response.materials || [];
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
		const goToAddMaterialPage = () => {
			router.push("/dashboard/addmaterial");
		};
		fetchData(); // Fetch data on component mount

		return {
			materials,
			nextPage,
			previousPage,
			currentPage,
			pageSize,
			goToAddMaterialPage,
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
		TableEmpty,
		AppLoading
	},
};
</script>
