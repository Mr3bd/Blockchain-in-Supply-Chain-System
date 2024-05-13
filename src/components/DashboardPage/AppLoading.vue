<template>
    <div v-if="isLoading" class="loading-overlay">
        <v-progress-circular color="#00a36c" indeterminate></v-progress-circular>

    </div>
</template>

<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style>
.loading-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: rgb(10 35 72);
    display: inline-block;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    z-index: 2501;
}

</style>
