// Define a reactive ref for the user object
import { ref } from "vue";

// Initialize the user object with null values
const roleModel = ref({
  role_id: null,
  role_name: null,
});

// Function to update the user object with API response data
const updateRole = (roleData) => {
  roleModel.value = roleData;
};

export { roleModel, updateRole };
