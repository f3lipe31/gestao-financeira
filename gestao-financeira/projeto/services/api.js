// services/api.js
import { Platform } from "react-native";

/**
 * URL base da API.
 * - No emulador Android do Android Studio, usamos o IP 10.0.2.2 para acessar o PC.
 * - Pode ser sobrescrita via variável de ambiente do Expo (EXPO_PUBLIC_API_URL).
 */
const DEFAULT_BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:3000"
  : "http://localhost:3000";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  listCategories:    ()        => request("/categories"),
  createCategory:    (data)    => request("/categories",        { method: "POST",   body: JSON.stringify(data) }),
  updateCategory:    (id, d)   => request(`/categories/${id}`,  { method: "PUT",    body: JSON.stringify(d) }),
  deleteCategory:    (id)      => request(`/categories/${id}`,  { method: "DELETE" }),

  listTransactions:  ()        => request("/transactions"),
  createTransaction: (data)    => request("/transactions",       { method: "POST",   body: JSON.stringify(data) }),
  updateTransaction: (id, d)   => request(`/transactions/${id}`, { method: "PUT",    body: JSON.stringify(d) }),
  deleteTransaction: (id)      => request(`/transactions/${id}`, { method: "DELETE" }),
};
