<template>
	<div class="container">
		<div class="input-box">
			<input type="text" placeholder="Name" v-model="itemName" />
		</div>
		<div class="input-box">
			<input type="number" placeholder="Quantity" v-model.number="itemQuantity" />
		</div>
		<button @click="addItem" class="add-button" :disabled="isInvalidQuantity">
			<span class="material-icons">add</span>
			Add
		</button>
	</div>
</template>

<script>
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
		addItem() {
			if (!this.isInvalidQuantity) {
				// Proceed with adding the item
				console.log('Adding item:', this.itemName, 'Quantity:', this.itemQuantity);
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
	width: 65%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* Center children horizontally */
}

.input-box {
	margin-bottom: 20px;
	width: 100%;
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
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.add-button i {
	margin-right: 5px;
}
</style>
