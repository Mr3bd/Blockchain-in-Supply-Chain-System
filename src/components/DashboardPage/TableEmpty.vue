<script setup>
defineProps({
    length: {
        type: Number,
        required: true
    },
    colms: {
        type: String,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <tr v-if="length === 0 && isLoading === false">
        <td :colspan="colms">
            <div class="no-records">
                <img src="@/assets/box.svg" alt="No Records Image" class="no-records-image" />
                <p>No Records</p>
            </div>
        </td>
    </tr>
</template>