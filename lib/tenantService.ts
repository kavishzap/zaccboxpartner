// services/tenantService.ts
import { API_BASE_URL } from "@/lib/apiClient";

/* ---------- API Types ---------- */
export type TenantDetailsDto = {
  accountingMethod?: string | null;
  accountingPeriodEnd?: string | null;
  accountingPeriodStart?: string | null;
  address: string | null;
  apiToken?: string | null;
  brn?: string | null;
  businessID?: string | null;
  businessType?: string | null;
  city?: string | null;
  companyNo?: string | null;
  companyType?: string | null;
  contactName: string | null;
  country: string | null;
  currency?: string | null;
  dateFormat?: string | null;
  directorName?: string | null;
  email?: string | null;
  fax?: string | null;
  hasClosingDate?: boolean | null;
  logo?: string | null;
  mobile?: string | null;
  name: string | null;
  phone?: string | null;
  postCode?: string | null;
  refID?: string | null;
  useClass?: boolean | null;
  vatNumber?: string | null;
  website?: string | null;
  allowEInvoicing?: boolean | null;
};

export type TenantModule = {
  id: string;
  isActive: boolean;
  name: string;
};

export type Tenant = {
  id: string;
  companyName: string;
  companyNameShortForm: string;
  adminEmail: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber: string | null;
  country: string | null;
  connectionString?: string | null;
  detailsDto: TenantDetailsDto | null;
  isActive: boolean;
  issuer?: string | null;
  modules: TenantModule[];
  name?: string | null; // duplicate of companyName sometimes
  validUpto: string; // ISO
  directors?: DirectorInput[] | null;
  ubOs?: UBOInput[] | null;
};

export type ApiEnvelope<T> = {
  data: T;
  message: string | null;
  succeeded: boolean;
  traceId?: string;
};

/* ---------- Fetch ---------- */
export const API_TENANTS_URL = `${API_BASE_URL}/api/tenants`;

// services/tenantService.ts
export async function getTenants(token?: string): Promise<Tenant[]> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // cache-buster + no-store
  const url = `${API_TENANTS_URL}?_=${Date.now()}`;
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });

  const text = await res.text();
  const json: ApiEnvelope<Tenant[]> = text
    ? JSON.parse(text)
    : { data: [], message: "Empty", succeeded: false };

  if (!res.ok || !json.succeeded) {
    throw new Error(json.message || `Failed to fetch tenants (${res.status})`);
  }
  return json.data || [];
}

/* ---------- Rich Row Type for UI ---------- */
export type PartnerRow = {
  /* identity */
  id: string;
  company: string;
  short: string;

  /* status */
  isActive: boolean;
  statusText: "Active" | "Inactive";

  /* contact block (stacked) */
  contactName: string;
  adminEmail: string;
  phoneNumber: string;

  /* location block (stacked) */
  address: string;
  country: string;

  /* expiry */
  validUptoRaw: string;
  expiresDisplay: string; // "—" or yyyy-mm-dd

  /* modules */
  modules: TenantModule[];
  modulesNames: string; // "Accounting, Expenses, Inventory"
  activeModuleCount: number;

  /* misc you might need later */
  issuer: string;
  details: TenantDetailsDto | null;
};

/* ---------- Mapper ---------- */
export function mapTenantsToPartnerRows(tenants: Tenant[]): PartnerRow[] {
  return tenants.map((t) => {
    const expiresDisplay =
      t.validUpto && !t.validUpto.startsWith("0001-01-01")
        ? new Date(t.validUpto).toISOString().slice(0, 10)
        : "—";

    const modulesNames = (t.modules || []).map((m) => m.name).join(", ");
    const activeModuleCount = (t.modules || []).filter(
      (m) => m.isActive
    ).length;

    return {
      id: t.id,
      company:
        t.companyName ?? t.detailsDto?.name ?? t.companyNameShortForm ?? "-",
      short: t.companyNameShortForm ?? "—",

      isActive: !!t.isActive,
      statusText: t.isActive ? "Active" : "Inactive",

      contactName: t.detailsDto?.contactName ?? "—",
      adminEmail: t.adminEmail || "—",
      phoneNumber: t.phoneNumber || "—",

      address: t.detailsDto?.address ?? "—",
      country: t.country ?? "—",

      validUptoRaw: t.validUpto,
      expiresDisplay,

      modules: t.modules || [],
      modulesNames,
      activeModuleCount,

      issuer: t.issuer ?? "",
      details: t.detailsDto ?? null,
    };
  });
}
/* ------------------------- Create payload types ------------------------ */
export type DirectorInput = {
  fullName: string;
  idType: string; // e.g. "National ID"
  idNumber: string;
  dateOfBirth: string | null; // ISO string (yyyy-mm-ddTHH:mm:ss.sssZ) or null
  nationality: string;
  residentialAddress: string;
  position?: string;
  email?: string;
  phone?: string;
  proofOfIdentityUrl?: string;
  proofOfAddressUrl?: string;
};

export type UBOInput = {
  fullName: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string | null; // ISO string or null
  nationality: string;
  residentialAddress: string;
  ownershipPercentage: number;
  proofOfIdentityUrl?: string;
};

export type CreateTenantPayload = {
  companyName: string;
  country: string;
  adminEmail: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  businessID?: string;
  address?: string;
  city?: string;
  postCode?: string;
  website?: string;
  directors?: DirectorInput[];
  ubOs?: UBOInput[]; // NOTE: key spelling matches your backend
  companyNameShortForm?: string;
  connectionString?: string;
  issuer?: string;
};

/* ------------------------------ API call ------------------------------- */
/**
 * Creates a tenant.
 * - `token` is optional; pass your Bearer token if the API requires auth.
 * - Throws an Error when the API responds with !ok or envelope.succeeded === false.
 */
export async function createTenant(
  payload: CreateTenantPayload,
  token?: string
): Promise<ApiEnvelope<any>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_TENANTS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  // Some backends return an envelope even on error; read text safely first.
  const text = await res.text();
  let json: ApiEnvelope<any> | null = null;
  try {
    json = text ? (JSON.parse(text) as ApiEnvelope<any>) : null;
  } catch {
    // not JSON, fall through to generic message below
  }

  if (!res.ok) {
    // Prefer server message if present
    const msg =
      json?.message ||
      `Failed to create tenant (${res.status} ${res.statusText})`;
    throw new Error(msg);
  }

  // When ok but envelope indicates failure
  if (json && json.succeeded === false) {
    throw new Error(json.message || "Failed to create tenant.");
  }

  // If server doesn't wrap in an envelope, fabricate one for consistency
  return (
    json || {
      data: null,
      message: "Created",
      succeeded: true,
    }
  );
}

/* --------------------------- Small date helper ------------------------- */
/** Convert a yyyy-mm-dd (from <input type="date">) to ISO, or return null. */
export function toIsoOrNull(dateStr?: string): string | null {
  if (!dateStr) return null;
  // new Date("yyyy-mm-dd") is treated as UTC by most runtimes; keep consistent
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export async function activateTenant(shortName: string, token?: string) {
  return toggleTenant(shortName, "activate", token);
}

export async function deactivateTenant(shortName: string, token?: string) {
  return toggleTenant(shortName, "deactivate", token);
}

async function toggleTenant(
  shortName: string,
  action: "activate" | "deactivate",
  token?: string
) {
  if (!shortName || shortName === "—") {
    throw new Error("Invalid tenant short name.");
  }

  const safe = encodeURIComponent(shortName);
  const url = `${API_TENANTS_URL}/${safe}/${action}`;

  const headers: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  console.log(`[tenantService] ${action.toUpperCase()} URL:`, url);
  console.log("[tenantService] headers:", headers);

  const res = await fetchWithTimeout(url, { method: "POST", headers }, 15000);

  console.log("[tenantService] status:", res.status, res.statusText);
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const msg = json?.message || `Failed to ${action} (${res.status})`;
    throw new Error(msg);
  }
  if (json && json.succeeded === false) {
    throw new Error(json.message || `Failed to ${action}.`);
  }
  return json ?? { succeeded: true, message: "OK", data: null };
}

function fetchWithTimeout(
  resource: string,
  options: RequestInit,
  timeout = 10000
): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]) as Promise<Response>;
}
export async function getTenantByShort(short: string, token?: string) {
  if (!short) {
    throw new Error("Tenant short name is required.");
  }

  const safeShort = encodeURIComponent(short);
  const url = `${API_TENANTS_URL}/${safeShort}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let json: ApiEnvelope<Tenant> | null = null;
  try {
    json = text ? (JSON.parse(text) as ApiEnvelope<Tenant>) : null;
  } catch {
    // ignore parse error
  }

  if (!res.ok) {
    throw new Error(json?.message || `Failed to fetch tenant ${short}`);
  }

  if (!json?.succeeded) {
    throw new Error(json?.message || `Failed to fetch tenant ${short}`);
  }

  return json.data;
}
