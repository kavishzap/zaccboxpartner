export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devapiv2.zsolu.com";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T>(
  path: string,
  {
    method = "GET",
    tenant,
    body,
    token,
    lang,
  }: {
    method?: HttpMethod;
    tenant?: string;
    body?: any;
    token?: string;
    lang?: string;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": lang || (typeof navigator !== "undefined" ? navigator.language : "en-US"),
  };
  if (tenant) headers["tenant"] = tenant;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = json?.message || `Request failed with ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}
