
<template>
	<div>
		<h1>Material List</h1>
		<table class="material-table">
			<thead>
				<tr>
					<th>Trans ID</th>
					<th>Name</th>
					<th>Quantity</th>
					<th>Logtime</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="material in materials.materials" :key="material.id">
					<td>{{ truncateTransId(material.trans_id) }}</td>
					<td>{{ material.name }}</td>
					<td>{{ material.quantity }}</td>
					<td>{{ material.logtime }}</td>
				</tr>
			</tbody>
		</table>
		<button @click="previousPage" :disabled="currentPage === 1">Previous Page</button>
		<button @click="nextPage">Next Page</button>
	</div>
</template>

<script>
import { ref } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file



export default {
	setup() {
		const materials = ref([]);
		let currentPage = ref(1);
		const pageSize = 10; // Change this according to your page size

		const fetchData = async () => {
			try {
				const response = await fetch(`http://127.0.0.1:8000/api/getMaterials?log_id=${getAccount().value}&page=${currentPage.value}&pageSize=${pageSize}`);
				const data = await response.json();
				console.log(data);
				materials.value = data;

			} catch (error) {
				console.error('Error:', error);
			}
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
			materials,
			nextPage,
			previousPage,
			currentPage
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
<style scoped>
.material-table {
	width: 100%;
	border-collapse: separate;
	/* Change to separate */
	border-radius: 10px;
	/* Add border radius */
}

.material-table th,
.material-table td {
	padding: 8px;
	text-align: left;
}

.material-table th {
	background-color: #CFCFCF;
	color: black;
	font-weight: bold;
	text-align: center;
	border: none;
}

.material-table tbody tr:nth-child(odd) {
	background-color: #1e293b;
}

.material-table tbody tr:nth-child(even) {
	background-color: #1e293b;
}

.material-table tbody tr td {
	color: white;
	text-align: center;
}

.material-table tbody tr {
	border-bottom: 1px solid white;
}

button {
	margin-top: 10px;
}
</style>