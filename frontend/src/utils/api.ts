// src/utils/api.ts

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 🚨 INTERCEPTOR: If token is expired or invalid
    if (response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Force redirect to login page
      window.location.href = "/"; 
      return null;
    }

    return response;
  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
};