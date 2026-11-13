const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, { method = "GET", body, token, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (form) headers["Content-Type"] = "application/x-www-form-urlencoded";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: form || (body === undefined ? undefined : JSON.stringify(body)),
    });
  } catch (error) {
    throw new ApiError(
      `Cannot reach the API. Check that FastAPI is running and VITE_API_URL is configured correctly. (${error.message})`,
      0,
    );
  }

  if (!response.ok) {
    let message = response.status >= 500
      ? `The API returned ${response.status}. Check the FastAPI terminal for the underlying error.`
      : `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.detail || message;
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (email, password) =>
    apiRequest("/auth/token", {
      method: "POST",
      form: new URLSearchParams({ username: email, password }),
    }),
  me: (token) => apiRequest("/auth/me", { token }),
  signup: (data) => apiRequest("/users", { method: "POST", body: data }),
  users: (token) => apiRequest("/users?limit=100", { token }),
  updateUserRole: (token, id, role) =>
    apiRequest(`/users/${id}/role`, { method: "PATCH", token, body: { role } }),
  deleteUser: (token, id) =>
    apiRequest(`/users/${id}`, { method: "DELETE", token }),
  categories: (params = "") => apiRequest(`/categories${params}`),
  createCategory: (token, data) =>
    apiRequest("/categories", { method: "POST", token, body: data }),
  updateCategory: (token, id, data) =>
    apiRequest(`/categories/${id}`, { method: "PUT", token, body: data }),
  deleteCategory: (token, id) =>
    apiRequest(`/categories/${id}`, { method: "DELETE", token }),
  events: (token) => apiRequest("/events?limit=100", { token }),
  updateEvent: (token, id, data) =>
    apiRequest(`/events/${id}`, { method: "PUT", token, body: data }),
  deleteEvent: (token, id) =>
    apiRequest(`/events/${id}`, { method: "DELETE", token }),
  bookings: (token) => apiRequest("/bookings", { token }),
  updateBookingStatus: (token, id, status) =>
    apiRequest(`/bookings/${id}/status`, { method: "PATCH", token, body: { status } }),
  packages: () => apiRequest("/packages?limit=100"),
  services: () => apiRequest("/services?limit=100"),
  createPackage: (token, data) =>
    apiRequest("/packages", { method: "POST", token, body: data }),
  updatePackage: (token, id, data) =>
    apiRequest(`/packages/${id}`, { method: "PUT", token, body: data }),
  deletePackage: (token, id) =>
    apiRequest(`/packages/${id}`, { method: "DELETE", token }),
  createService: (token, data) =>
    apiRequest("/services", { method: "POST", token, body: data }),
  updateServiceListing: (token, id, data) =>
    apiRequest(`/services/${id}`, { method: "PUT", token, body: data }),
  deleteServiceListing: (token, id) =>
    apiRequest(`/services/${id}`, { method: "DELETE", token }),
  cart: (token) => apiRequest("/cart", { token }),
  addCartItem: (token, data) =>
    apiRequest("/cart/items", { method: "POST", token, body: data }),
  updateCartItem: (token, id, quantity) =>
    apiRequest(`/cart/items/${id}`, { method: "PATCH", token, body: { quantity } }),
  deleteCartItem: (token, id) =>
    apiRequest(`/cart/items/${id}`, { method: "DELETE", token }),
  clearCart: (token) => apiRequest("/cart", { method: "DELETE", token }),
  favorites: (token) => apiRequest("/favorites", { token }),
  addFavorite: (token, data) =>
    apiRequest("/favorites", { method: "POST", token, body: data }),
  deleteFavorite: (token, id) =>
    apiRequest(`/favorites/${id}`, { method: "DELETE", token }),
  createEvent: (token, data) =>
    apiRequest("/events", { method: "POST", token, body: data }),
  checkout: (token, eventId) =>
    apiRequest("/bookings/checkout", { method: "POST", token, body: { event_id: eventId } }),
};
