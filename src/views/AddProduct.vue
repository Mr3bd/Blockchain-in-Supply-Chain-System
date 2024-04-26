<template>

    <div class="container">
        <h2 class="input-title">Add Product</h2>
        <form>
            <div class="input-box">
                <label for="name">Name</label>
                <input id="name" type="text" placeholder="Enter name" v-model="product.name" />
            </div>
            <div class="input-box">
                <label for="price">Price per one (ETH)</label>
                <input id="price" type="number" placeholder="Enter price" v-model.number="product.price" />
            </div>
            <div class="input-box">
                <label for="quantity">Quantity</label>
                <input id="quantity" type="number" placeholder="Enter quantity" v-model.number="product.quantity" />
            </div>
            <h3 class="input-sub-title">Materials</h3>
            <div class="material-list" style="margin-left: 30px;">

                <ul v-for="(materialBlock, index) in materialBlocks" :key="index">
                    <li>
                        <div class="material-block-row">
                            <select v-model="materialBlock.materialId">
                                <option value="">Select Material</option>
                                <option v-for="material in materials" :key="material.trans_id"
                                    :value="material.trans_id" :disabled="materialSelected(material.trans_id)">
                                    {{ material.name }} ({{ material.quantity }} available)
                                </option>
                            </select>
                            <template v-if="materialBlock.materialId != ''">
                                <input type="number" class="custom-number-input" v-model="materialBlock.quantity"
                                    :min="0" :max="findMaterialQuantity(materialBlock.materialId)">
                            </template>

                            <button type="button" @click="deleteMaterialBlock(materialBlock)" class="remove-button">
                                <span class="material-icons">remove</span>
                            </button>
                        </div>
                    </li>
                </ul>

            </div>
            <template v-if="canAddBlock() == true">
                <button type="button" @click="addMaterialBlock" class="add-button">
                    <span class="material-icons">add</span>
                </button>
            </template>

            <div style="margin-bottom: 16px; margin-top: 16px;">
                <h3 class="input-sub-title">Cost</h3>
                <div style="color: #00a36c; font-weight: 600;"> {{ calculateCost() }} (Eth)</div>
            </div>
        </form>


        <div class='add-button-container'>
            <button @click="addProduct" class="add-button" :class="{ 'disabled': isInvalidData }"
                :disabled="isInvalidData">
                <span class="material-icons">add</span>
                <span>Add</span>
            </button>
        </div>
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
                })
                .catch((error) => {
                    console.error("Error while making Get request:", error);
                });
        };
        const addMaterialBlock = () => {
            if (canAddBlock() == true) {
                materialBlocks.value.push({ materialId: '', quantity: 0 });
            }
        };

        const deleteMaterialBlock = (block) => {
            const blockIndex = materialBlocks.value.findIndex(existingBlock => {
                // Replace with the property used for identification (e.g., block.id, block.index)
                return existingBlock === block;
            });

            if (blockIndex !== -1) {
                materialBlocks.value.splice(blockIndex, 1);
            }
        };

        const canAddBlock = () => {
            return materialBlocks.value.length + 1 <= materials.value.length;
        }

        const isInvalidData = computed(() => {
            return (
                product.value.name === '' ||
                product.value.quantity <= 0 ||
                product.value.price <= 0.0 || allBlocksHasValidOption() == false
            );
        });

        const allBlocksHasValidOption = () => {
            let valid = true;
            if (materialBlocks.value.length <= 0) {
                valid = false;
                return valid;
            }
            else {
                for (const block of materialBlocks.value) {
                    if (block.materialId == '') {
                        valid = false;
                        return valid;
                    }
                }
            }
            return valid;
        }

        const allBlocksHasValidQuantity = () => {
            let valid = true;
            for (const block of materialBlocks.value) {
                if (block.quantity <= 0 || block.quantity > materials.value.find(m => m.trans_id === block.materialId).quantity) {
                    valid = false;
                    return valid;
                }
            }
            return valid;
        }



        const materialSelected = (materialId) => {
            return materialBlocks.value.some(block => block.materialId === materialId);
        };

        const addProduct = async () => {
            console.log('fdfd');
            if (allBlocksHasValidQuantity() == false) {
                alert('Please enter valid quantity');
                return;
            }
        };
        const findMaterialQuantity = (materialId) => {
            // Find the material object with the matching ID from materials
            const foundMaterial = materials.value.find(m => m.trans_id === materialId);
            return foundMaterial ? foundMaterial.quantity : 0;
        };
        const calculateCost = () => {
            let totalCost = 0;

            for (const block of materialBlocks.value) {
                const foundMaterial = materials.value.find(m => m.trans_id === block.materialId);
                totalCost += foundMaterial ? foundMaterial.price * block.quantity : 0;
            }

            const roundedCostString = totalCost.toFixed(5); // Round to 5 decimal places as string
            const roundedCost = parseFloat(roundedCostString);


            return roundedCost;
        }
        fetchData(); // Fetch data on component mount

        return {
            materials,
            materialBlocks,
            product,
            addMaterialBlock,
            addProduct,
            findMaterialQuantity,
            materialSelected,
            isInvalidData,
            canAddBlock,
            deleteMaterialBlock,
            calculateCost,


        };
    },
    components: {
        Snackbar
    },
};


</script>