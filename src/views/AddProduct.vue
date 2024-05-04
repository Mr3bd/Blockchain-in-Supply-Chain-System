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
import { ref, computed, onMounted } from 'vue';
import Web3 from 'web3'; // Import Web3 library
import { getAccount, set_balance } from "@/web3Service.js" // Import the web3Service.js file
import { getData, postData } from "@/apiService.js";
import { ProductManagementABI, productContractAddress } from '@/contracts/ProductManagementABI.js';
import Snackbar from '@/components/Snackbar.vue';

export default {
    setup() {
        const snackbarRef = ref(null);

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
            if (allBlocksHasValidQuantity() == false) {
                alert('Please enter valid quantity');
                return;
            }

            else {
                let matIds = [];
                let ownerIds = [];
                let costs = [];
                let qts = []
                let materials_json = []
                const web3 = new Web3(window.ethereum); 
                const contractAddress = productContractAddress;

                for (const block of materialBlocks.value) {
                    const foundMaterial = materials.value.find(m => m.trans_id === block.materialId);
                    matIds.push(foundMaterial.material_id);
                    ownerIds.push(foundMaterial.owner_id);
                    const costPerBlock = web3.utils.toWei((foundMaterial.price * block.quantity).toString(), 'ether');
                    costs.push(costPerBlock);
                    qts.push(block.quantity)
                    const mat = {
                        id: foundMaterial.trans_id,
                        quantity: block.quantity
                    };
                    materials_json.push(mat)
                }
                ownerIds = ownerIds.map(id => web3.utils.toChecksumAddress(id));

                const contract = new web3.eth.Contract(ProductManagementABI, contractAddress);
                const totalBlockCost = web3.utils.toWei((calculateCost()).toString(), 'ether');

                try {
                    const priceInWei = web3.utils.toWei((product.value.price).toString(), 'ether'); // Convert price to Wei

                    const tx = await contract.methods.addProduct(
                        product.value.name,
                        priceInWei,
                        product.value.quantity,
                        4,
                        matIds,
                        ownerIds,
                        costs,
                        qts
                    ).send({
                        from: getAccount().value, value: totalBlockCost });
                    const trans_id = tx['transactionHash'];
                    const productId = tx.events.ProductAdded.returnValues.productId.toString();
                    set_balance();


                    await postData("addProduct", {
                        log_id: getAccount().value,
                        trans_id: trans_id,
                        product_id: productId,
                        name: product.value.name,
                        quantity: product.value.quantity,
                        price: product.value.price,
                        material_ids: JSON.stringify(materials_json)
                    }).then((response) => {

                            if (response.success != null) {
                                console.log('success django');
                                materialBlocks.value = [];
                                materials.value = [];
                                product.value = {
                                    name: '',
                                    quantity: 0,
                                    price: 0,
                                };
                                snackbarRef.value.show('The product has been added', 'success', 3000);
                            }
                            else {
                                console.log('failed django');

                                snackbarRef.value.show('Error adding product', 'error', 3000);
                            }
                        })
                        .catch((error) => {
                            console.log(error);

                            snackbarRef.value.show('Error adding product', 'error', 3000);
                        });

                } catch (error) {
                    console.error(error);
                    snackbarRef.value.show('Error adding product', 'error', 3000);
                }
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
        onMounted(() => {
            // Ensure that snackbarRef is populated after the component is mounted
            snackbarRef.value = snackbarRef;
        });
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
            snackbarRef,


        };
    },
    components: {
        Snackbar
    },
};


</script>