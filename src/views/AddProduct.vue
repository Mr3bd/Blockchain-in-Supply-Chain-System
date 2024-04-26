<template>

    <div class="container">
        <h2>Add Product</h2>
        <form @submit.prevent="addProduct">
            <div class="input-box">
                <label for="name">Name:</label>
                <input id="name" type="text" placeholder="Enter name" v-model="product.name" />
            </div>
            <div class="input-box">
                <label for="price">Price (for each one):</label>
                <input id="price" type="number" placeholder="Enter price" v-model.number="product.price" />
            </div>
            <div class="input-box">
                <label for="quantity">Quantity:</label>
                <input id="quantity" type="number" placeholder="Enter quantity" v-model.number="product.quantity" />
            </div>
            <div class="material-list">
                <h3>Materials</h3>
                <ul v-for="(materialBlock, index) in materialBlocks" :key="index">
                    <li>
                        <select v-model="materialBlock.materialId">
                            <option value="">Select Material</option>
                            <option v-for="material in materials" :key="material.trans_id" :value="material.trans_id"
                                :disabled="materialSelected(material.trans_id)">
                                {{ material.name }} ({{ material.quantity }} available)
                            </option>

                        </select>
                        <input type="number" v-model="materialBlock.quantity" :min="0"
                            :max="findMaterialQuantity(materialBlock.materialId)">
                    </li>
                </ul>
                <button type="button" @click="addMaterialBlock">Add Material</button>
            </div>
            <button @click="addItem" class="add-button" :class="{ 'disabled': isInvalidData }"
                :disabled="isInvalidData">
                <span class="material-icons">add</span>
                <span>Add</span>
            </button>
        </form>
        <Snackbar ref="snackbarRef" />
    </div>

</template>


<script>
import { ref, computed } from 'vue';
import { getAccount } from "@/web3Service.js" // Import the web3Service.js file
import { getData } from "@/apiService.js";
import Snackbar from '@/components/Snackbar.vue';

export default {
    setup() {
        const product = ref({
            name: '',
            quantity: 0,
            price: 0,
        });

        const materials = ref([]);
        const materialBlocks = ref([]);

        const fetchData = async () => {
            getData(`getAvailableMaterials?log_id=${getAccount().value}`)
                .then((response) => {
                    materials.value = response.materials || [];
                    console.log(materials.value.length);
                    console.log(materials.value);
                })
                .catch((error) => {
                    console.error("Error while making Get request:", error);
                });
        };
        const addMaterialBlock = () => {
            if (materialBlocks.value.length + 1 <= materials.value.length) {
                materialBlocks.value.push({ materialId: '', quantity: 0 });
            }
        };

        const isInvalidData = () => {
            return product.name === '' || product.quantity <= 0 || product.price <= 0.0; // Checks if quantity is non-positive
        }

        const materialSelected = (materialId) => {
            return materialBlocks.value.some(block => block.materialId === materialId);
        };

        const addProduct = async () => {
            // Validate quantities before submission
            let isValid = true;
            for (const block of materialBlocks.value) {
                if (!block.materialId) {
                    isValid = false;
                    alert('Please select a material for each block.');
                    break;
                }
                if (block.quantity > materials.value.find(m => m.id === block.materialId).quantity) {
                    isValid = false;
                    alert(`Insufficient quantity for ${materials.value.find(m => m.id === block.materialId).name}`);
                    break;
                }
            }

            if (isValid) {
                // Prepare product data with selected materials and quantities
                const productData = { ...product.value, materials: [] };
                for (const block of materialBlocks.value) {
                    if (block.materialId) {
                        productData.materials.push({
                            materialId: block.materialId,
                            quantity: block.quantity,
                        });
                    }
                }

                // Call your API to add the product
                // ...

                // Clear form and material blocks after successful submission
                product.value.name = '';
                product.value.quantity = 0;
                product.value.price = 0;
                materialBlocks.value = [];
            }
        };
        const findMaterialQuantity = (materialId) => {
            // Find the material object with the matching ID from materials
            const foundMaterial = materials.value.find(m => m.trans_id === materialId);
            return foundMaterial ? foundMaterial.quantity : 0;
        };

        fetchData(); // Fetch data on component mount

        return {
            materials,
            materialBlocks,
            addMaterialBlock,
            addProduct,
            product,
            findMaterialQuantity,
            materialSelected,
            isInvalidData


        };
    },
    components: {
        Snackbar
    },
};


</script>