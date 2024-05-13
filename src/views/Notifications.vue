<template>
	<div class="app-header">
		<h2 class="page-head">Notifications</h2>

	</div>
	<table class="app-table">
		<thead>
			<tr>
				<th>Description</th>
				<th>Logtime</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="noti in notifications" :key="noti.id">
				<td>{{ noti.description }}</td>
				<td>{{ noti.logtime }}</td>
			</tr>
		</tbody>
		<TableEmpty :length="notifications.length" colms="2" :isLoading="isLoading"></TableEmpty>

	</table>
	<div class="pn-buttons-container">
		<button class='prev-next-btn' @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
		<button class='prev-next-btn' @click="nextPage" :disabled="notifications.length < pageSize">Next Page</button>
	</div>
	<AppLoading :isLoading="isLoading"></AppLoading>

</template>

<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import { getData, pageSize } from "@/apiService.js";
import TableEmpty from "../components/DashboardPage/TableEmpty.vue";
import { user } from '@/globalVariables';
import AppLoading from "../components/DashboardPage/AppLoading.vue";

export default {
	setup() {
		const notifications = ref([]);
		let currentPage = ref(1);
		const isLoading = ref(false);

		const fetchData = async () => {
			getData(`getNotifications?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`,
				() => {
					isLoading.value = true;
				},
				() => {
					isLoading.value = false;
				}
			)
				.then((response) => {
					notifications.value = response.notifications || [];
					user.value.unReadNoti = response.unReadNoti || 0;

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
			notifications,
			nextPage,
			previousPage,
			currentPage,
			pageSize,
			TableEmpty,
			isLoading
		};
	},
	components: {
		TableEmpty,
		AppLoading
	},
};
</script>
