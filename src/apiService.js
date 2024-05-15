const base_url = "http://127.0.0.1:8000/api"; // Your base API URL
import { user } from "@/globalVariables";

export const pageSize = 8;
export const postData = async (
  endpoint,
  data,
  showLoadingCallback,
  hideLoadingCallback
) => {
  console.log(`${base_url}/${endpoint}`);
  showLoadingCallback();

  try {
    const response = await fetch(`${base_url}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${user.value.token}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    hideLoadingCallback();
    return responseData;
  } catch (error) {
    hideLoadingCallback();

    console.error("Error while making POST request:", error);
    throw error;
  }
};

export const getData = async (
  endpoint,
  showLoadingCallback,
  hideLoadingCallback
) => {
  console.log(`${base_url}/${endpoint}`);
  showLoadingCallback();
  try {
    const response = await fetch(`${base_url}/${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${user.value.token}`,
      },
  
    });
    const responseData = await response.json();
    hideLoadingCallback();

    return responseData;
  } catch (error) {
    hideLoadingCallback();

    console.error("Error while making POST request:", error);
    throw error;
  }
};
