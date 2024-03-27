<template>
    <header class="app-bar">
        <div class="dashboard-logo">
            <img alt="BSC Logo" src="@/assets/logo.svg" width="96" />
            <h2 class="green">BSC</h2>
        </div>
        <p class="role">{{ user.name }} ({{ user.role_info.role_name }})</p>
    </header>
</template>

<script setup>
import { user } from '@/globalVariables';
</script>

<style scoped>
.app-bar {
    background-color: var(--vt-c-vdark);
    color: white;
    padding: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* Center vertically */
}

.dashboard-logo {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
}

.dashboard-logo img {
    width: 2rem;
    margin-right: 16px;
    margin-left: 16px;
}

.role {
    margin-right: 4px;
    /* Adjust margin as needed */
}
</style>