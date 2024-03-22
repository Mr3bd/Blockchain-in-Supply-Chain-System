<template>
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
	</div>
</template>

<script>
import { getAccount, getAccounts, logout } from "@/web3Service.js" // Import the web3Service.js file
import Web3 from 'web3'; // Import Web3 library
import MaterialManagementContract from '@/contracts/MaterialManagement.json'; // Import the MaterialManagement contract ABI

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
	methods: {
		addItem: async function () { // Mark the function as async
			if (!this.isInvalidQuantity) {
				const contractAddress = '0xfB972D171f6Ff674C7fBdeb19891177CFC51cbee';
				const contract = new Web3.eth.Contract(MaterialManagementContract.abi, contractAddress); // Use Web3 from the Web3 library
				// Proceed with adding the item
				try {
					// Call the addMaterial function of the smart contract
					const accounts = await Web3.eth.requestAccounts(); // Request user accounts
					const tx = await contract.methods.addMaterial(this.itemName, this.itemQuantity).send({ from: accounts[0] }); // Use accounts[0]
					console.log('Adding item:', tx);
				} catch (error) {
					console.error('Error adding material:', error);
				}
			}
		}
	}
};
</script>

<style scoped>
.container {
	background-color: #1e293b;
	padding: 20px;
	border-radius: 8px;
	width: 50%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.input-box {
	margin-bottom: 20px;
	/* Increased spacing between input boxes */
	width: 100%;
}

.input-box label {
	display: block;
	/* Display labels as block elements */
	margin-bottom: 5px;
	/* Add space between labels and inputs */
}

.input-box input {
	width: 100%;
	padding: 10px;
	border: none;
	border-radius: 4px;
	background-color: #fff;
}

.add-button {
	background-color: #4caf50;
	/* Default button color */
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 4px;
	cursor: pointer;
	width: 100%;
	/* Make button take full width */
	max-width: 200px;
	/* Limit maximum width of button */
	display: flex;
	justify-content: center;
	/* Center content horizontally */
	align-items: center;
	/* Center content vertically */
}

.add-button:disabled {
	background-color: #7f8c8d;
	/* Disabled button color */
}

.add-button span {
	margin-left: 5px;
	/* Add spacing between icon and text */
}

.add-button i {
	margin-right: 5px;
	/* Add spacing between icon and text */
}

.disabled {
	cursor: not-allowed;
	/* Change cursor when button is disabled */
}
</style>
