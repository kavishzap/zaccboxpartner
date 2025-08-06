"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ZaccboxLogo from "../../../assets/logo_zaccbox_white.png";
import {
  Building2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Home,
  Mail,
  Phone,
  User,
  Users,
  IdCard,
  Crown,
  Briefcase,
  FileText,
  LayoutGrid,
  BarChart3,
  Globe,
  MapPin,
  Hash,
  Shield,
  ExternalLink,
  Edit3,
  Percent,
  LogOut,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Swal from "sweetalert2";
import { getTenantByShort, type Tenant } from "@/lib/tenantService";
import Footer from "@/components/footer";
type Director = {
  fullName?: string | null;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  idType?: string | null;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  residentialAddress?: string | null;
};

type UBO = {
  fullName?: string | null;
  idType?: string | null;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  residentialAddress?: string | null;
  ownershipPercentage?: number | null;
};

const bgDots = {
  backgroundImage: "radial-gradient(circle,#454545, transparent 1px)",
  backgroundSize: "10px 10px",
};

function isoToDate(iso?: string | null) {
  if (!iso) return "—";
  const t = iso.indexOf("T");
  const s = t > 0 ? iso.slice(0, t) : iso;
  return s || "—";
}

function cls(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function PartnerDetailsPage() {
  const router = useRouter();
  const params = useParams<{ short: string }>();
  const short = params?.short;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tab, setTab] = useState<
    "overview" | "directors" | "financial" | "documents" | "modules"
  >("overview");

  useEffect(() => {
    if (!short) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken") ?? undefined
        : undefined;

    (async () => {
      try {
        setLoading(true);
        const data = await getTenantByShort(short, token);
        setTenant(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load partner");
        Swal.fire({
          title: "Error",
          text: e?.message || "Failed to load partner",
          icon: "error",
          background: "#111827",
          color: "#f9fafb",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [short]);

  const directors: Director[] = useMemo(() => {
    const anyD = (tenant as any)?.directors;
    return Array.isArray(anyD) ? anyD : [];
  }, [tenant]);

  const ubos: UBO[] = useMemo(() => {
    const anyU = (tenant as any)?.ubOs;
    return Array.isArray(anyU) ? anyU : [];
  }, [tenant]);

  const companyName =
    tenant?.companyName ||
    tenant?.detailsDto?.name ||
    tenant?.companyNameShortForm ||
    short ||
    "—";
  const adminName = useMemo(() => {
    const fn = tenant?.firstName?.trim();
    const ln = tenant?.lastName?.trim();
    if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
    return tenant?.detailsDto?.contactName || "—";
  }, [tenant]);

  const phone = tenant?.detailsDto?.mobile || tenant?.detailsDto?.phone || "—";
  const addr1 = tenant?.detailsDto?.address || "—";
  const city = tenant?.detailsDto?.city || "—";
  const postCode = tenant?.detailsDto?.postCode || "—";
  const website = tenant?.detailsDto?.website || "";
  const country = tenant?.detailsDto?.country || tenant?.country || "—";
  const style = { color: "transparent", filter: "invert(0)" };
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      background: "#1f2937", // Dark background
      color: "#f9fafb", // Light text
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("companyShortName");
        localStorage.removeItem("refreshTokenExpiryTime");
        localStorage.removeItem("userName");
        localStorage.removeItem("currency");
        localStorage.removeItem("tenantLogo");
        localStorage.removeItem("pending2FA");

        Swal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          background: "#1f2937",
          color: "#f9fafb",
          timer: 1500,
          showConfirmButton: false,
        });

        router.push("/");
      }
    });
  };
  return (
    <div className="min-h-screen bg-gray-950" style={bgDots}>
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/partner-dashboard">
                <Image
                  src={ZaccboxLogo}
                  alt="Zaccbox Logo"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                  priority
                  style={style}
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                  Partner Management
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="w-full py-3 text-sm">
          <ol className="flex items-center gap-2 text-gray-400">
            {/* Home */}
            <li>
              <Link
                href="/partner-dashboard"
                className="inline-flex items-center gap-2 hover:text-gray-200 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>

            {/* Separator */}
            <li aria-hidden="true" className="text-gray-600">
              <ChevronRight className="h-4 w-4" />
            </li>

            {/* Parent */}
            <li>
              <Link
                href="/partner-dashboard"
                className="hover:text-gray-200 transition-colors"
              >
                Partner Management
              </Link>
            </li>

            {/* Separator */}
            <li aria-hidden="true" className="text-gray-600">
              <ChevronRight className="h-4 w-4" />
            </li>

            {/* Current page */}
            <li aria-current="page" className="text-gray-500">
              View Partner
            </li>
          </ol>
        </nav>
      </div>
      {/* Top summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 grid place-items-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                {companyName}
              </h1>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className={cls(
                  "px-2.5 py-1 border-0",
                  tenant?.isActive
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                )}
              >
                {tenant?.isActive ? (
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1.5" />
                )}
                {tenant?.isActive ? "Active" : "Inactive"}
              </Badge>

              {tenant?.companyNameShortForm ? (
                <Badge
                  variant="outline"
                  className="border-indigo-500/40 text-indigo-300 bg-indigo-500/10"
                >
                  {tenant.companyNameShortForm}
                </Badge>
              ) : null}

              <div className="flex items-center text-gray-400 ml-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">
                  {addr1 !== "—" ? `${addr1}, ` : ""}
                  {country}
                </span>
              </div>

              {tenant?.adminEmail ? (
                <div className="flex items-center text-gray-400 ml-3">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{tenant.adminEmail}</span>
                </div>
              ) : null}

              {phone && phone !== "—" ? (
                <div className="flex items-center text-gray-400 ml-3">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{phone}</span>
                </div>
              ) : null}

              <div className="flex items-center text-gray-400 ml-3">
                <Users className="h-4 w-4 mr-1" />
                <span>{directors.length} directors</span>
              </div>
            </div>
          </div>

          {/* stat tiles */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full md:w-auto mt-5">
          <Card className="bg-emerald-900/15 border-emerald-800/40 min-w-[220px]">
            <CardContent className="p-4">
              <div className="text-xs text-emerald-300 mb-1 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Business ID
              </div>
              <div className="text-emerald-100 font-semibold truncate">
                {tenant?.detailsDto?.businessID ||
                  tenant?.companyNameShortForm ||
                  "—"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/15 border-blue-800/40 min-w-[220px]">
            <CardContent className="p-4">
              <div className="text-xs text-blue-300 mb-1 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Directors
              </div>
              <div className="text-blue-100 font-semibold">
                {directors.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-fuchsia-900/15 border-fuchsia-800/40 min-w-[220px]">
            <CardContent className="p-4">
              <div className="text-xs text-fuchsia-300 mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                UBOs
              </div>
              <div className="text-fuchsia-100 font-semibold">
                {ubos.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-900/15 border-amber-800/40 min-w-[220px]">
            <CardContent className="p-4">
              <div className="text-xs text-amber-300 mb-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Admin
              </div>
              <div className="text-amber-100 font-semibold truncate">
                {adminName}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Tabs */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm border-b border-gray-800">
            {(
              [
                ["overview", "Overview", LayoutGrid],
                ["directors", "Directors", Users],
                ["financial", "Financial", BarChart3],
                ["documents", "Documents", FileText],
                ["modules", "Modules", Shield],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cls(
                  "px-3 py-2 rounded-t-md inline-flex items-center gap-2 border-b-2 -mb-px",
                  tab === key
                    ? "text-white border-blue-500"
                    : "text-gray-400 border-transparent hover:text-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          {tab === "overview" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-300 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm break-words">
                  <div>
                    <div className="text-gray-400">Company Name</div>
                    <div className="text-gray-100 font-semibold">
                      {companyName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Company Short Form</div>
                    <div className="text-gray-100 font-semibold">
                      {tenant?.companyNameShortForm || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Business ID</div>
                    <div className="text-gray-100 font-semibold">
                      {tenant?.detailsDto?.businessID ||
                        tenant?.companyNameShortForm ||
                        "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Status</div>
                    <div className="text-gray-100 font-semibold">
                      {tenant?.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-emerald-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm break-words">
                  <div>
                    <div className="text-gray-400">Website</div>
                    <div className="text-gray-100 font-semibold inline-flex items-center gap-2">
                      {website ? (
                        <a
                          href={website}
                          target="_blank"
                          className="hover:underline inline-flex items-center gap-1 break-all"
                          rel="noreferrer"
                        >
                          {website}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Address</div>
                    <div className="text-gray-100 font-semibold">{addr1}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">City</div>
                    <div className="text-gray-100 font-semibold">{city}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Post Code</div>
                    <div className="text-gray-100 font-semibold">
                      {postCode}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-fuchsia-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Admin Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Admin Name</div>
                    <div className="text-gray-100 font-semibold">
                      {adminName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Admin Email</div>
                    <div className="text-gray-100 font-semibold inline-flex items-center gap-2">
                      {tenant?.adminEmail ? (
                        <>
                          <Mail className="h-4 w-4 text-blue-400" />
                          {tenant.adminEmail}
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Phone Number</div>
                    <div className="text-gray-100 font-semibold inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-400" />
                      {phone || "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "directors" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {directors.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8 text-center text-gray-400">
                    No directors.
                  </CardContent>
                </Card>
              ) : (
                directors.map((d, i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-200 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-400" />
                        Director {i + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 break-words">
                        <Field label="Full Name" value={d.fullName} />
                        <Field label="Position" value={d.position} />
                        <Field
                          icon={Mail}
                          label="Email"
                          value={d.email}
                          className="break-words whitespace-normal"
                        />
                        <Field
                          icon={Phone}
                          label="Phone"
                          value={d.phone}
                          className="break-words whitespace-normal"
                        />

                        <Field icon={IdCard} label="ID Type" value={d.idType} />
                        <Field label="ID Number" value={d.idNumber} />
                        <Field
                          label="DOB"
                          value={isoToDate(d.dateOfBirth || "")}
                        />
                        <Field
                          icon={Globe}
                          label="Nationality"
                          value={d.nationality}
                        />
                        <div className="col-span-2">
                          <Field
                            icon={Home}
                            label="Residential Address"
                            value={d.residentialAddress}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              {ubos.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8 text-center text-gray-400">
                    No UBOs.
                  </CardContent>
                </Card>
              ) : (
                ubos.map((u, i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-200 flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-400" />
                        UBO {i + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 break-words">
                        <Field label="Full Name" value={u.fullName} />
                        <Field
                          icon={Percent}
                          label="Ownership %"
                          value={`${u.ownershipPercentage ?? ""}`}
                        />
                        <Field icon={IdCard} label="ID Type" value={u.idType} />
                        <Field label="ID Number" value={u.idNumber} />
                        <Field
                          label="DOB"
                          value={isoToDate(u.dateOfBirth || "")}
                        />
                        <Field
                          icon={Globe}
                          label="Nationality"
                          value={u.nationality}
                        />
                        <div className="col-span-2">
                          <Field
                            icon={Home}
                            label="Residential Address"
                            value={u.residentialAddress}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === "financial" && (
            <div className="mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-gray-400 text-sm">
                  No financial summary yet.
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "documents" && (
            <div className="mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-gray-400 text-sm">
                  Documents area coming soon.
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "modules" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(tenant?.modules || []).map((m) => (
                <Card
                  key={m.id}
                  className={cls(
                    "border",
                    m.isActive
                      ? "bg-gray-900 border-gray-800"
                      : "bg-gray-900/60 border-gray-800/60"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield
                        className={cls(
                          "h-4 w-4",
                          m.isActive ? "text-emerald-400" : "text-gray-500"
                        )}
                      />
                      <span
                        className={cls(
                          m.isActive ? "text-gray-100" : "text-gray-400"
                        )}
                      >
                        {m.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <Badge
                      variant="secondary"
                      className={cls(
                        "border-0",
                        m.isActive
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-gray-700/40 text-gray-300"
                      )}
                    >
                      {m.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              {(tenant?.modules || []).length === 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8 text-gray-400 text-sm">
                    No modules.
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading / error overlays */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-[60]">
          <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-4 text-gray-200 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            Loading partner…
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const v = (value ?? "").toString().trim() || "—";
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5 flex items-center gap-1.5">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
        {label}
      </div>
      <div
        className={`text-gray-100 break-words whitespace-normal ${className}`}
      >
        {v}
      </div>
    </div>
  );
}
