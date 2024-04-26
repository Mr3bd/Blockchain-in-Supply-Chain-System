<template>
    <header class="app-bar">
        <div class="dashboard-logo">
            <img alt="BSC Logo" src="@/assets/logo.svg" width="96" />
            <h2 class="green">BSC</h2>
        </div>
        <p :title="user.id" class="role">{{ user.name }} ({{ user.role_info.role_name }})</p>
    </header>
</template>

<script setup>
import { user } from '@/globalVariables';
</script>

<style scoped>
.app-bar {
    background-color: #fff;
    color: #5d5d5d;
    padding: 10px 20px;
    margin-bottom: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
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