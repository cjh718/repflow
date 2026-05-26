import { QueryClient } from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export const queryClient = new QueryClient();

export function getApiUrl() {
  return API_URL;
}

export async function apiRequest(
  method: string,
  path: string,
  body?: object,
  token?: string | null
) {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }

  return res.json();
}
