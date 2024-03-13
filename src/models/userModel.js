// Define a reactive ref for the user object
import { ref } from "vue";

// Initialize the user object with null values
const userModel = ref({
  id: null,
  name: null,
  role: null,
  deleted: null,
  logtime: null,
});

// Function to update the user object with API response data
const updateUser = (userData) => {
  userModel.value = userData;
};

export { userModel, updateUser };
