const base_url = "http://127.0.0.1:8000/api"; // Your base API URL

export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${base_url}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if required
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error while making POST request:", error);
    throw error;
  }
};
