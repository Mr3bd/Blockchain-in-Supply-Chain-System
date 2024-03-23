<template>
	<h1>Add Material</h1>
	<div class="container">
		<div class="input-box">
			<label for="itemName">Name:</label>
			<input id="itemName" type="text" placeholder="Enter name" v-model="itemName" />
		</div>
		<div class="input-box">
			<label for="itemQuantity">Quantity:</label>
			<input id="itemQuantity" type="number" placeholder="Enter quantity" v-model.number="itemQuantity" />
		</div>
		<button @click="addItem" class="add-button" :class="{ 'disabled': isInvalidQuantity }"
			:disabled="isInvalidQuantity">
			<span class="material-icons">add</span>
			<span>Add</span>
		</button>

		<Snackbar ref="snackbarRef" />

	</div>
</template>

<script>
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import Web3 from 'web3'; // Import Web3 library
import MaterialManagementABI from '@/contracts/MaterialManagementABI.js';
import { postData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';

export default {
	data() {
		return {
			itemName: '',
			itemQuantity: 0
		};
	},
	computed: {
		isInvalidQuantity() {
			return this.itemQuantity <= 0; // Checks if quantity is non-positive
		}
	},
	components: {
		Snackbar
	},
	methods: {
		addItem: async function () { // Mark the function as async

			if (!this.isInvalidQuantity) {
				const web3 = new Web3(window.ethereum);

				const contractAddress = '0xaCCD01B6823823D8734602Eb8Eb6ffDB1e60caf5';
				const contract = new web3.eth.Contract(MaterialManagementABI, contractAddress); // Use Web3 from the Web3 library

				console.log(contractAddress);
				// Proceed with adding the item
				try {
					// Call the addMaterial function of the smart contract
					const tx = await contract.methods.addMaterial(this.itemName, this.itemQuantity).send({ from: getAccount().value }); // Use accounts[0]
					const trans_id = tx['transactionHash'];
					console.log('Adding item:', trans_id);

					await postData("addMaterial", { log_id: getAccount().value, trans_id: trans_id, name: this.itemName, quantity: this.itemQuantity })
						.then((response) => {
							this.$refs.snackbarRef.show('The material has been added', 'success', 3000);
						})
						.catch((error) => {
							this.$refs.snackbarRef.show('Error adding material', 'error', 3000);
						});
				} catch (error) {
					console.error(error);

					this.$refs.snackbarRef.show('Error adding material', 'error', 3000);
				}
			}
		}
	}
};

</script>