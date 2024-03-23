<template>
    <transition name="snackbar">
        <div v-if="showSnackbar" class="custom-snackbar" :class="[snackbarColor]">
            <div class="content">
                <span class="text">{{ message }}</span>
                <button @click="dismissSnackbar" class="dismiss-btn">Dismiss</button>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        timeout: {
            type: Number,
            default: 6000
        }
    },
    data() {
        return {
            showSnackbar: false,
            message: '',
            snackbarColor: 'success',
            key: 0 // Added key property
        }
    },
    methods: {
        show(message, color = 'success', timeout = 6000) {
            this.message = message;
            this.snackbarColor = color;
            this.showSnackbar = true;
            this.key++; // Increment key to force re-render
            setTimeout(() => {
                this.dismissSnackbar();
            }, timeout);
        },
        dismissSnackbar() {
            this.showSnackbar = false;
        }
    }
}
</script>

<style scoped>
.custom-snackbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;
    border-radius: 4px;
    color: #fff;
    background-color: #323232;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    flex-grow: 1;
    /* Take up remaining space */
    word-wrap: break-word;
    /* Break long words to prevent overflow */
}

.dismiss-btn {
    min-width: 80px;
    /* Adjust width as needed */
    margin-left: 10px;
    /* Adjust margin as needed */
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    outline: none;
}

.success {
    background-color: var(--primary);
    /* Red color for error messages */
}

.error {
    background-color: #f44336;
    /* Red color for error messages */
}

.info {
    background-color: #2196f3;
    /* Blue color for info messages */
}

/* Animation */
.snackbar-enter-active,
.snackbar-leave-active {
    transition: opacity 0.5s;
}

.snackbar-enter,
.snackbar-leave-to {
    opacity: 0;
}
.warning {
    background-color: #ff9800;
    /* Orange color for warning messages */
}
</style>
