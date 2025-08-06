"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ZaccboxLogo from "../assets/logo_zaccbox_white.png";
import Image from "next/image";
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Edit,
  Eye,
  Trash2,
  LogOut,
  Search,
  Calendar,
  MapPin,
  Mail,
  Unlock,
  UserPlus,
  Loader2,
} from "lucide-react";
import { AddPartnerModal } from "@/components/add-partner-modal";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTenants,
  mapTenantsToPartnerRows,
  type PartnerRow,
  activateTenant,
  deactivateTenant,
} from "@/lib/tenantService";
import { formatDate } from "@/lib/utils/formatDate";
import Link from "next/link";
import Footer from "@/components/footer";
const backgroundStyle = {
  backgroundImage: "radial-gradient(circle,#454545, transparent 1px)",
  backgroundSize: "10px 10px",
};

export default function PartnerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const style = { color: "transparent", filter: "invert(0)" };
  const reload = async () => {
    window.location.reload();
  };
  // tiny helper (optional)
  const showWorking = (html: string) =>
    Swal.fire({
      title: "Working…",
      html,
      allowOutsideClick: false,
      showConfirmButton: false,
      ...swalDarkTheme,
      didOpen: () => {
        Swal.showLoading();
      },
    });

  // ACTIVATE
  const handleActivate = async (partner: PartnerRow) => {
    if (!partner.short || partner.short === "—") {
      return Swal.fire({
        title: "Missing short name",
        text: "This partner doesn’t have a valid short name.",
        icon: "error",
        ...swalDarkTheme,
      });
    }

    const result = await Swal.fire({
      title: "Activate Partner?",
      text: `This will activate ${partner.company}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, activate it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      ...swalDarkTheme,
    });
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("authToken") || undefined;

    // ⛔️ DO NOT await this:
    showWorking("Activating partner.");

    try {
      await activateTenant(partner.short, token);
      Swal.close(); // close loader
      await Swal.fire({
        title: "Activated",
        text: `${partner.company} has been activated.`,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        ...swalDarkTheme,
      });
      await reload();
    } catch (e: any) {
      Swal.close(); // make sure loader closes on error too
      await Swal.fire({
        title: "Error",
        text: e?.message || "Failed to activate partner.",
        icon: "error",
        ...swalDarkTheme,
      });
    }
  };

  // DEACTIVATE
  const handleDeactivate = async (partner: PartnerRow) => {
    if (!partner.short || partner.short === "—") {
      return Swal.fire({
        title: "Missing short name",
        text: "This partner doesn’t have a valid short name.",
        icon: "error",
        ...swalDarkTheme,
      });
    }

    const result = await Swal.fire({
      title: "Deactivate Partner?",
      text: `This will deactivate ${partner.company}. You can reactivate later.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      ...swalDarkTheme,
    });
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("authToken") || undefined;

    // ⛔️ DO NOT await this:
    showWorking("Deactivating partner.");

    try {
      await deactivateTenant(partner.short, token);
      Swal.close();
      await Swal.fire({
        title: "Deactivated",
        text: `${partner.company} has been deactivated.`,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        ...swalDarkTheme,
      });
      await reload();
    } catch (e: any) {
      Swal.close();
      await Swal.fire({
        title: "Error",
        text: e?.message || "Failed to deactivate partner.",
        icon: "error",
        ...swalDarkTheme,
      });
    }
  };

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

  const statsData = [
    {
      title: "Total Partners",
      value: 24,
      subtitle: "22 Active",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Users",
      value: 156,
      subtitle: "Across all partners",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      title: "Total Subscriptions",
      value: "MUR 125,000",
      subtitle: "This month",
      icon: CreditCard,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
  ];

  // Auth gate
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("authToken");
    if (!isLoggedIn || !token) {
      router.replace("/");
      return;
    }
    // Fetch tenants after gate passes
    (async () => {
      try {
        const tenants = await getTenants(token);
        console.log("tenants raw", tenants[0]); // 👀
        const mapped = mapTenantsToPartnerRows(tenants);
        console.log("rows mapped", mapped[0]); // should include address/country
        setRows(mapped);
      } catch (e: any) {
        setErr(e?.message || "Failed to load partners");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.company.toLowerCase().includes(q) ||
        r.short.toLowerCase().includes(q) ||
        (r.address || "").toLowerCase().includes(q) ||
        (r.country || "").toLowerCase().includes(q) ||
        r.phoneNumber.toLowerCase().includes(q) ||
        r.contactName.toLowerCase().includes(q) ||
        r.adminEmail.toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1); // reset page when search changes
  }, [searchTerm]);

  useEffect(() => {
    // clamp page if pageSize or data changes
    const tp = Math.max(1, Math.ceil(total / pageSize));
    if (page > tp) setPage(tp);
  }, [total, pageSize, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  const swalDarkTheme = {
    background: "#1f2937",
    color: "#f3f4f6",
    customClass: {
      popup: "rounded-lg shadow-lg border border-gray-700",
      title: "text-lg font-semibold",
      confirmButton:
        "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md",
      cancelButton:
        "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md",
    },
  };

  return (
    <div className="min-h-screen bg-gray-950" style={backgroundStyle}>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards (example: compute Total Partners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-emerald-900/15 border-emerald-800/40 border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Background accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-gray-400 uppercase">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-lg flex items-center justify-center ${stat.bgColor}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
                {stat.subtitle && (
                  <p className="text-sm text-gray-400 mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Bar */}
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          {/* Title */}
          <div className="flex items-center gap-2 shrink-0">
            <CardTitle className="text-lg sm:text-xl">
              Partners Overview
            </CardTitle>
          </div>

          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-white/90 dark:bg-gray-900 backdrop-blur-sm border-gray-200/50 dark:border-gray-800 w-full"
              />
            </div>
          </div>

          {/* Button */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <Button
              onClick={() => router.push("/partner-dashboard/add")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Add Partner
            </Button>
          </div>
        </div>

        {/* Partners Table */}
        <Card className="bg-white/90 dark:bg-gray-900 backdrop-blur-sm border-white/20 dark:border-gray-800 shadow-lg">
          <CardContent>
            {err && <div className="p-4 text-red-400 text-sm">{err}</div>}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200/50 dark:border-gray-800">
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Admin Contact
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expires
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                          <span>Loading partners…</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-6 text-center text-sm text-gray-400"
                      >
                        No partners found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((partner) => (
                      <TableRow
                        key={partner.id}
                        className="border-gray-200/50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            {/* Top row: icon + company name */}
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {partner.company}
                              </span>
                            </div>

                            {/* Bottom row: short name • status */}
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              <span className="text-gray-400">
                                {partner.short}
                              </span>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  partner.isActive
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              />
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  partner.isActive
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {partner.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white">
                              {partner.address || "—"}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {partner.country || "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {partner.contactName}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {partner.adminEmail}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {partner.phoneNumber}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {formatDate(partner.validUptoRaw, "medium")}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              onClick={() =>
                                router.push(
                                  `/partner-dashboard/Edit/${partner.short}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Button>

                            <Button
                              onClick={() =>
                                router.push(
                                  `/partner-dashboard/view/${partner.short}`
                                )
                              }
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
                            >
                              <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                            {partner.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                                aria-label="Deactivate partner"
                                onClick={() => handleDeactivate(partner)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                                aria-label="Activate partner"
                                onClick={() => handleActivate(partner)}
                              >
                                <Unlock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200/50 dark:border-gray-800">
                {/* Left: range */}
                <div className="text-sm text-gray-400">
                  Showing <span className="text-gray-200">{showingFrom}</span>–
                  <span className="text-gray-200">{showingTo}</span> of{" "}
                  <span className="text-gray-200">{total}</span>
                </div>

                {/* Right: page size + pager */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Rows per page</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => setPageSize(Number(v))}
                    >
                      <SelectTrigger className="h-9 w-[90px] bg-gray-900 border-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50, 100].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 bg-transparent"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-[80px] text-center text-sm text-gray-400">
                      Page <span className="text-gray-200">{page}</span> /{" "}
                      <span className="text-gray-200">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 bg-transparent"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />

      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
