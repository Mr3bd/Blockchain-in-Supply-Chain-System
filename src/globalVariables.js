import { ref } from "vue";
import { userModel } from "@/models/userModel.js"; // Import the userModel

// Define the user variable as a ref with the structure of userModel
export const user = ref(userModel);
