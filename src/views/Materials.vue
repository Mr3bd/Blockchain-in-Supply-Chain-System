<template>
	<div>
		<h1>Material List</h1>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="material in materials.materials" :key="material.id">
					<td>{{ material.trans_id }}</td>
					<td>{{ material.name }}</td>
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
	}
};
</script>