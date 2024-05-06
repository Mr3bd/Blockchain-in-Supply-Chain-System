<template>
	<div class="app-header">
		<h2 class="page-head">Logs</h2>

	</div>
	<table class="app-table">
		<thead>
			<tr>
				<th>Trans ID</th>
				<th>User ID</th>
				<th>User Name</th>
				<th>Description</th>
				<th>Logtime</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="log in logs" :key="log.trans_id">
				<td>{{ truncateTransId(log.trans_id) }}</td>
				<td>{{ truncateTransId(log.owner_info.owner_id) }}</td>
				<td>{{ log.owner_info.owner_name }}</td>
				<td>{{ log.description }}</td>
				<td>{{ log.logtime }}</td>
			</tr>
		</tbody>
		<TableEmpty :length="logs.length" colms="5"></TableEmpty>

	</table>
	<div class="pn-buttons-container">
		<button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
		<button class='prev-next-btn' @click="nextPage" :disabled="logs.length < pageSize">Next Page</button>
	</div>

</template>

<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import { getData, pageSize } from "@/apiService.js";
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";

export default {
	setup() {
		const logs = ref([]);
		let currentPage = ref(1);
		
		const fetchData = async () => {
			getData(`getSystemLogs?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`)
				.then((response) => {
					logs.value = response.logs || [];
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

		return {
			logs,
			nextPage,
			previousPage,
			currentPage,
			pageSize,
			TableEmpty
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
		TableEmpty
	},
};
</script>
