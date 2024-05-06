<template>
    <header class="app-bar">
        <div class="dashboard-logo">
            <img alt="BSC Logo" src="@/assets/logo.svg" width="96" />
            <h2 class="green">BSC</h2>
        </div>
        <h3 class="page-head">
            {{ user.role_info.role_name }} Dashboard
        </h3>

        <p :title="user.id" class="user-role" style="color: #2C3E50;">
            {{ user.name }} |
            <span style="color: #00a36c;margin-left: 4px;" class="material-icons">wallet</span>
            <span style="color: #00a36c;"> {{ accountBalance }} ETH</span>

        </p>
    </header>
</template>

<script setup>

import { user, accountBalance } from '@/globalVariables';


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

.user-role, .user-role span {
        margin-right: 4px;
            font-weight: 600;
            display: flex;
            align-items: center;
    /* Adjust margin as needed */
}

</style>