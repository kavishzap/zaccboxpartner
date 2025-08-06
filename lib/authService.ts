import { apiFetch } from "@/lib/apiClient";

export type ApiEnvelope<T> = {
  data: T;
  message: string;
  succeeded: boolean;
  traceId?: string;
};

export type AuthPayload = {
  email: string;
  password: string;
  registrationSource?: string;
};

export type AuthData = {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  tenantLogo: string | null;
  expiryExpoTime: number;
  tokenExpirationInSeconds: number;
  isTwoFA: boolean;
  userId: string;
  registrationSource: string | null;
  currency: string | null;
  name: string | null;
  parentTenantId: string | null;
  trialPeriodExpired: boolean;
  isPaidSubscription: boolean;
};

export async function authenticate(tenant: string, payload: AuthPayload) {
  return apiFetch<ApiEnvelope<AuthData>>("/api/auth/authenticate", {
    method: "POST",
    tenant,
    body: {
      email: payload.email,
      password: payload.password,
      registrationSource: payload.registrationSource ?? "web",
    },
  });
}
