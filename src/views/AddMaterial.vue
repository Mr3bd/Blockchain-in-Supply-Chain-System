<template>
	<div class="container">
		<h2 class="input-title">Add Material</h2>
		<div class="input-box">
			<label for="itemName">* Name</label>
			<input id="itemName" type="text" placeholder="Enter name" v-model="itemName" />
		</div>
		<div class="input-box">
			<label for="itemPrice">* Price (for each one)</label>
			<input id="itemPrice" type="number" placeholder="Enter price" v-model.number="itemPrice" />
		</div>
		<div class="input-box">
			<label for="itemQuantity">* Quantity</label>
			<input id="itemQuantity" type="number" placeholder="Enter quantity" v-model.number="itemQuantity" />
		</div>

		<div class='add-button-container'>
			<button @click="addItem" class="add-button" :class="{ 'disabled': isInvalidData }"
				:disabled="isInvalidData">
				<span class="material-icons">add</span>
				<span>Add</span>
			</button>
		</div>
		<Snackbar ref="snackbarRef" />

	</div>
</template>

<script>
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import Web3 from 'web3'; // Import Web3 library
import { MaterialManagementABI, materialContractAddress } from '@/contracts/MaterialManagementABI.js';
import { postData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';

export default {
	data() {
		return {
			itemName: '',
			itemQuantity: 0,
			itemPrice: 0.0,
		};
	},
	computed: {
		isInvalidData() {
			return this.itemName === '' || this.itemQuantity <= 0 || this.itemPrice <= 0.0; // Checks if quantity is non-positive
		}
	},
	components: {
		Snackbar
	},
	methods: {
		addItem: async function () { // Mark the function as async

			if (!this.isInvalidData) {
				const web3 = new Web3(window.ethereum);

				const contractAddress = materialContractAddress;
				const contract = new web3.eth.Contract(MaterialManagementABI, contractAddress); // Use Web3 from the Web3 library

				console.log(contractAddress);
				// Proceed with adding the item
				const priceInWei = web3.utils.toWei((this.itemPrice * 100).toString(), 'ether'); // Convert price to Wei

				try {
					// Call the addMaterial function of the smart contract
					const tx = await contract.methods.addMaterial(this.itemName, this.itemQuantity, priceInWei).send({ from: getAccount().value }); // Use accounts[0]
					const trans_id = tx['transactionHash'];
					const materialId = tx.events.MaterialAdded.returnValues.materialId.toString();
					set_balance();

					await postData("addMaterial", {
						log_id: getAccount().value,
						trans_id: trans_id,
						name: this.itemName,
						quantity: this.itemQuantity,
						price: this.itemPrice,
						material_id: materialId
					})
						.then((response) => {

							if (response.success != null) {
								this.itemName = '';
								this.itemQuantity = 0;
								this.itemPrice = 0;
								this.$refs.snackbarRef.show('The material has been added', 'success', 3000);
							}
							else {
								this.$refs.snackbarRef.show('Error adding material', 'error', 3000);
							}
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