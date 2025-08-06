"use client";

import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTenant, toIsoOrNull } from "@/lib/tenantService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ZaccboxLogo from "../../assets/logo_zaccbox_white.png";
import { countryMetaData } from "@/lib/utils/countryMetaData";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Building2,
  CreditCard,
  Trash2,
  LogOut,
  Calendar,
  MapPin,
  Mail,
  User,
  Crown,
  FileText,
  Flag,
  Hash,
  Globe,
  Home,
  ChevronRight,
  Phone,
  Shield,
  Info,
  CheckCircle,
  Plus,
  Briefcase,
  IdCard,
  Percent,
  Upload,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { Progress } from "@radix-ui/react-progress";
import Footer from "@/components/footer";
interface Director {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

interface UBO {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  ownershipPercentage: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

const stepTitles = [
  { title: "Company Info", icon: Building2 },
  { title: "Admin Contact", icon: User },
  { title: "Directors", icon: Users },
  { title: "UBOs", icon: Crown },
  { title: "Documents", icon: FileText },
];

type UploadTileProps = {
  id: string;
  title: string;
  hintTop?: string;
  hintBottom?: string;
  accept?: string;
  icon?: React.ReactNode;
  file: File | null;
  setFile: (f: File | null) => void;
};

const formatKB = (b: number) => `${(b / 1024).toFixed(2)} KB`;

export function UploadTile({
  id,
  title,
  hintTop = "Click to upload or drag & drop",
  hintBottom = "PDF, DOC, DOCX, JPG, PNG up to 10MB",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  icon = <Upload className="h-8 w-8" />,
  file,
  setFile,
}: UploadTileProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
        {title}
      </label>

      {/* Selected -> success chip */}
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-600 bg-emerald-900/20 p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-emerald-500/40">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </span>
            <div className="leading-tight">
              <p
                className="text-emerald-300 font-medium truncate max-w-[34ch]"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-xs text-emerald-400">
                {formatKB(file.size)} • Ready for upload
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-rose-400 hover:text-rose-300"
            aria-label="Remove file"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ) : (
        // Empty -> dashed drop area
        <label
          htmlFor={id}
          className="group grid place-items-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-900 p-8 text-center hover:border-indigo-500/70 cursor-pointer transition-colors"
        >
          <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gray-800 text-indigo-400 group-hover:bg-gray-700">
            {icon}
          </div>
          <p className="text-sm text-gray-300 font-medium">{hintTop}</p>
          {hintBottom ? (
            <p className="text-xs text-gray-400">{hintBottom}</p>
          ) : null}
        </label>
      )}

      <input
        id={id}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

const backgroundStyle = {
  backgroundImage: "radial-gradient(circle,#454545, transparent 1px)",
  backgroundSize: "10px 10px",
};

export default function AddPartnerPage() {
  const router = useRouter();
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
  const [fileInc, setFileInc] = useState<File | null>(null);
  const [filePoa, setFilePoa] = useState<File | null>(null);
  const [fileBiz, setFileBiz] = useState<File | null>(null);
  const selectedCount = [fileInc, filePoa, fileBiz].filter(Boolean).length;
  const [currentStep, setCurrentStep] = useState(1);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [ubos, setUbos] = useState<UBO[]>([]);

  // Company + admin (Step 1 & 2)
  const [companyName, setCompanyName] = useState("");
  const [companyShortForm, setCompanyShortForm] = useState("");
  const [businessID, setBusinessID] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // helpers to edit array items
  const setDirectorField = (i: number, k: keyof Director, v: string) =>
    setDirectors((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [k]: v } : d))
    );

  const setUBOField = (i: number, k: keyof UBO, v: string) =>
    setUbos((prev) => prev.map((u, idx) => (idx === i ? { ...u, [k]: v } : u)));

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const addDirector = () => {
    const newDirector: Director = {
      id: Date.now().toString(),
      fullName: "",
      position: "",
      email: "",
      phone: "",
      idType: "",
      idNumber: "",
      dateOfBirth: "",
      nationality: "",
      address: "",
    };
    setDirectors([...directors, newDirector]);
  };

  const removeDirector = (id: string) => {
    setDirectors(directors.filter((director) => director.id !== id));
  };

  const addUBO = () => {
    const newUBO: UBO = {
      id: Date.now().toString(),
      fullName: "",
      position: "",
      email: "",
      phone: "",
      ownershipPercentage: "",
      idType: "",
      idNumber: "",
      dateOfBirth: "",
      nationality: "",
      address: "",
    };
    setUbos([...ubos, newUBO]);
  };

  const removeUBO = (id: string) => {
    setUbos(ubos.filter((ubo) => ubo.id !== id));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // basic guard
    if (
      !companyName ||
      !country ||
      !adminEmail ||
      !adminFirstName ||
      !adminLastName ||
      !adminPassword
    ) {
      return Swal.fire({
        title: "Missing Information",
        text: "Please complete all required fields before proceeding.",
        icon: "warning",
        background: "#1f2937",
        color: "#f9fafb",
      });
    }

    const payload = {
      companyName,
      country,
      adminEmail,
      firstName: adminFirstName,
      lastName: adminLastName,
      password: adminPassword,
      phoneNumber: adminPhone,
      businessID,
      address,
      city,
      postCode,
      website,
      directors: directors.map((d) => ({
        fullName: d.fullName,
        idType: d.idType || "National ID",
        idNumber: d.idNumber,
        dateOfBirth: toIsoOrNull(d.dateOfBirth),
        nationality: d.nationality,
        residentialAddress: d.address,
        position: d.position,
        email: d.email,
        phone: d.phone,
        proofOfIdentityUrl: "",
        proofOfAddressUrl: "",
      })),
      ubOs: ubos.map((u) => ({
        fullName: u.fullName,
        idType: u.idType || "National ID",
        idNumber: u.idNumber,
        dateOfBirth: toIsoOrNull(u.dateOfBirth),
        nationality: u.nationality,
        residentialAddress: u.address,
        ownershipPercentage: u.ownershipPercentage
          ? Number(u.ownershipPercentage)
          : 0,
        proofOfIdentityUrl: "",
      })),
      companyNameShortForm: companyShortForm || "",
      connectionString: "",
      issuer: "",
    };

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken") ?? undefined
        : undefined;

    // OPEN loading modal (do NOT await)
    Swal.fire({
      title: "Creating partner…",
      html: "Please wait while we save your data.",
      allowOutsideClick: false,
      background: "#1f2937",
      color: "#f9fafb",
      didOpen: () => Swal.showLoading(),
    });

    try {
      await createTenant(payload, token);

      // close loading and show success
      Swal.close();
      await Swal.fire({
        title: "Success",
        text: "Partner created successfully.",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#f9fafb",
      });

      // reset
      setCurrentStep(1);
      setDirectors([]);
      setUbos([]);
      setFileInc(null);
      setFilePoa(null);
      setFileBiz(null);
      // router.push("/partner-dashboard"); // optional
    } catch (err: any) {
      // close loading and show error
      Swal.close();
      await Swal.fire({
        title: "Error",
        text:
          err?.message || "Something went wrong while creating the partner.",
        icon: "error",
        background: "#1f2937",
        color: "#f9fafb",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1 */}
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Building2 className="h-4 w-4 text-blue-500" />
                Company Name *
              </Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                className="h-11"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="shortForm"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Hash className="h-4 w-4 text-blue-500" />
                Company Short Form
              </Label>
              <Input
                id="shortForm"
                placeholder="e.g., ABC Corp"
                className="h-11"
                value={companyShortForm}
                onChange={(e) => setCompanyShortForm(e.target.value)}
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <Label
                htmlFor="businessId"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CreditCard className="h-4 w-4 text-blue-500" />
                Business ID *
              </Label>
              <Input
                id="businessId"
                placeholder="Enter business ID"
                className="h-11"
                required
                value={businessID}
                onChange={(e) => setBusinessID(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Flag className="h-4 w-4 text-blue-500" />
                Country *
              </Label>

              {/* Make the trigger look exactly like an Input */}
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-11 w-full bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {countryMetaData.map((country) => (
                    <SelectItem key={country.name} value={country.name}>
                      {country.name}{" "}
                      {country.currencyCode ? `(${country.currencyCode})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Globe className="h-4 w-4 text-blue-500" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://www.company.com"
                className="h-11"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Home className="h-4 w-4 text-blue-500" />
                Address *
              </Label>
              <Input
                id="address"
                placeholder="Enter full address"
                className="h-11"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <MapPin className="h-4 w-4 text-blue-500" />
                City *
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                className="h-11"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="postCode"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Hash className="h-4 w-4 text-blue-500" />
                Post Code *
              </Label>
              <Input
                id="postCode"
                placeholder="Enter post code"
                className="h-11"
                required
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="h-4 w-4 text-green-500" />
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  className="h-11"
                  required
                  value={adminFirstName}
                  onChange={(e) => setAdminFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="h-4 w-4 text-green-500" />
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  className="h-11"
                  required
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="adminEmail"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-green-500" />
                Admin Email *
              </Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@company.com"
                className="h-11"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Phone className="h-4 w-4 text-green-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  className="h-11"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Shield className="h-4 w-4 text-green-500" />
                  Password *
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter secure password"
                    className="h-11 pr-10" // padding right for icon space
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Card className="bg-gray-900 border border-gray-800">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-sm text-gray-200">
                    <p className="font-semibold mb-2 text-white">
                      Important Information:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-400" />
                        This person will be the primary administrator for the
                        partner account
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-400" />
                        They will have full access to manage the partner
                        settings and users
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-400" />
                        The email will be used for system notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-400" />
                        Password must be secure and contain at least 8
                        characters
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Directors Information</h3>
              </div>
              <Button
                onClick={addDirector}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Director
              </Button>
            </div>

            {directors.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-300 font-medium">
                    No directors added yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    Click "Add Director" to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {directors.map((director, index) => (
                  <Card
                    key={director.id}
                    className="bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-sm text-gray-200">
                            Director {index + 1}
                          </CardTitle>
                        </div>
                        <Button
                          onClick={() => removeDirector(director.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <User className="h-3 w-3" />
                          Full Name *
                        </Label>
                        <Input
                          placeholder="Enter full name"
                          className="h-9 bg-gray-800 border-gray-700"
                          value={director.fullName}
                          onChange={(e) =>
                            setDirectorField(index, "fullName", e.target.value)
                          }
                        />
                      </div>

                      {/* Position */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Briefcase className="h-3 w-3" />
                          Position
                        </Label>
                        <Select
                          value={director.position}
                          onValueChange={(v) =>
                            setDirectorField(index, "position", v)
                          }
                        >
                          <SelectTrigger
                            className=" w-full         
         h-11            
         px-3           
         rounded-md
         border border-input
         bg-transparent
         text-sm
         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
         dark:focus:ring-offset-gray-900"
                          >
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="Managing Director">
                              Managing Director
                            </SelectItem>
                            <SelectItem value="Chairman">Chairman</SelectItem>
                            <SelectItem value="Executive Director">
                              Executive Director
                            </SelectItem>
                            <SelectItem value="Non-Executive Director">
                              Non-Executive Director
                            </SelectItem>
                            <SelectItem value="Director">Director</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Mail className="h-3 w-3" />
                          Email *
                        </Label>
                        <Input
                          type="email"
                          placeholder="director@company.com"
                          className="h-9 bg-gray-800 border-gray-700"
                          value={director.email}
                          onChange={(e) =>
                            setDirectorField(index, "email", e.target.value)
                          }
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Phone className="h-3 w-3" />
                          Phone
                        </Label>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          className="h-9 bg-gray-800 border-gray-700"
                          value={director.phone}
                          onChange={(e) =>
                            setDirectorField(index, "phone", e.target.value)
                          }
                        />
                      </div>

                      {/* ID Type */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <IdCard className="h-3 w-3" />
                          ID Type
                        </Label>
                        <Select
                          value={director.idType}
                          onValueChange={(v) =>
                            setDirectorField(index, "idType", v)
                          }
                        >
                          <SelectTrigger
                            className=" w-full         
         h-11            
         px-3           
         rounded-md
         border border-input
         bg-transparent
         text-sm
         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
         dark:focus:ring-offset-gray-900"
                          >
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Driver License">
                              Driver's License
                            </SelectItem>
                            <SelectItem value="National ID">
                              National ID
                            </SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="Social Security Number">
                              Social Security Number
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* ID Number */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Hash className="h-3 w-3" />
                          ID Number
                        </Label>
                        <Input
                          placeholder="Enter ID number"
                          className="h-9 bg-gray-800 border-gray-700"
                          value={director.idNumber}
                          onChange={(e) =>
                            setDirectorField(index, "idNumber", e.target.value)
                          }
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Calendar className="h-3 w-3" />
                          Date of Birth
                        </Label>
                        <Input
                          type="date"
                          className="h-9 bg-gray-800 border-gray-700"
                          value={director.dateOfBirth}
                          onChange={(e) =>
                            setDirectorField(
                              index,
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* Nationality */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Flag className="h-3 w-3" />
                          Nationality
                        </Label>
                        <Select
                          value={director.nationality}
                          onValueChange={(v) =>
                            setDirectorField(index, "nationality", v)
                          }
                        >
                          <SelectTrigger className="h-11 w-full bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {countryMetaData.map((country) => (
                              <SelectItem
                                key={country.name}
                                value={country.name}
                              >
                                {country.name}{" "}
                                {country.currencyCode
                                  ? `(${country.currencyCode})`
                                  : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Residential Address */}
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Home className="h-3 w-3" />
                          Residential Address *
                        </Label>
                        <Input
                          placeholder="Enter address"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={director.address}
                          onChange={(e) =>
                            setDirectorField(index, "address", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold">
                  Ultimate Beneficial Owners (UBOs)
                </h3>
              </div>
              <Button
                onClick={addUBO}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add UBO
              </Button>
            </div>

            {ubos.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-amber-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-300 font-medium">
                    No beneficial owners added yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    Add First UBO to continue
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ubos.map((ubo, index) => (
                  <Card
                    key={ubo.id}
                    className="bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 dark:bg-amber-600 rounded-lg flex items-center justify-center">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-sm">
                            UBO {index + 1}
                          </CardTitle>
                        </div>
                        <Button
                          onClick={() => removeUBO(ubo.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <User className="h-3 w-3" />
                          Full Name *
                        </Label>
                        <Input
                          placeholder="Enter full name"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={ubo.fullName}
                          onChange={(e) =>
                            setUBOField(index, "fullName", e.target.value)
                          }
                        />
                      </div>

                      {/* Ownership Percentage */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Percent className="h-3 w-3" />
                          Ownership Percentage *
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={ubo.ownershipPercentage}
                          onChange={(e) =>
                            setUBOField(
                              index,
                              "ownershipPercentage",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* ID Type */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <IdCard className="h-3 w-3" />
                          ID Type *
                        </Label>
                        <Select
                          value={ubo.idType}
                          onValueChange={(v) => setUBOField(index, "idType", v)}
                        >
                          <SelectTrigger className="h-11 w-full bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Driver License">
                              Driver's License
                            </SelectItem>
                            <SelectItem value="National ID">
                              National ID
                            </SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="Social Security Number">
                              Social Security Number
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* ID Number */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Hash className="h-3 w-3" />
                          ID Number *
                        </Label>
                        <Input
                          placeholder="Enter ID number"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={ubo.idNumber}
                          onChange={(e) =>
                            setUBOField(index, "idNumber", e.target.value)
                          }
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Calendar className="h-3 w-3" />
                          Date of Birth *
                        </Label>
                        <Input
                          type="date"
                          placeholder="dd/mm/yyyy"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={ubo.dateOfBirth}
                          onChange={(e) =>
                            setUBOField(index, "dateOfBirth", e.target.value)
                          }
                        />
                      </div>

                      {/* Nationality */}
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Flag className="h-3 w-3" />
                          Nationality *
                        </Label>
                        <Select
                          value={ubo.nationality}
                          onValueChange={(v) =>
                            setUBOField(index, "nationality", v)
                          }
                        >
                          <SelectTrigger className="h-11 w-full bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {countryMetaData.map((country) => (
                              <SelectItem
                                key={country.name}
                                value={country.name}
                              >
                                {country.name}{" "}
                                {country.currencyCode
                                  ? `(${country.currencyCode})`
                                  : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Residential Address */}
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs flex items-center gap-1 text-gray-300">
                          <Home className="h-3 w-3" />
                          Residential Address *
                        </Label>
                        <Input
                          placeholder="Enter address"
                          className="h-11 bg-gray-800 border-gray-700"
                          required
                          value={ubo.address}
                          onChange={(e) =>
                            setUBOField(index, "address", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-200">
                Required Documents
              </h3>
            </div>

            {/* Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UploadTile
                id="incorporation"
                title="Certificate of Incorporation *"
                hintTop="Click to upload certificate of incorporation"
                hintBottom="PDF, DOC, DOCX, or image files up to 10MB"
                file={fileInc}
                setFile={setFileInc}
              />

              <UploadTile
                id="proofAddress"
                title="Proof of Address *"
                hintTop="Click to upload proof of address"
                hintBottom="Utility bill, bank statement, or lease agreement"
                file={filePoa}
                setFile={setFilePoa}
              />

              <UploadTile
                id="businessReg"
                title="Business Registration Document *"
                hintTop="Click to upload business registration document"
                hintBottom="Official business registration or license"
                file={fileBiz}
                setFile={setFileBiz}
              />
            </div>

            {/* Summary banner */}
            {selectedCount > 0 && (
              <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
                <p className="flex items-center gap-2 text-emerald-300 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  Documents Ready for Upload
                </p>
                <p className="mt-1 text-sm text-emerald-400">
                  {selectedCount} document(s) selected. Files will be uploaded
                  when you submit the form.
                </p>
              </div>
            )}

            {/* Guidelines card */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-amber-400" />
                  </div>
                  <CardTitle className="text-sm text-gray-100">
                    Document Upload Guidelines
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="font-semibold text-gray-200 mb-2">
                      Accepted Formats:
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" /> PDF
                        documents
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        Microsoft Word (DOC, DOCX)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        JPEG/PNG images
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-2">
                      Requirements:
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        Maximum file size: 10MB
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        Clear, readable documents
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        Official letterhead preferred
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-2">
                      Security:
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" /> All
                        files encrypted
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" />{" "}
                        Secure storage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-amber-400" /> GDPR
                        compliant
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
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
              Add Partner
            </li>
          </ol>
        </nav>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 py-6">
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-blue-600 dark:text-blue-300">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3 bg-gray-200 dark:bg-gray-700"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const IconComponent = step.icon;

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 dark:bg-green-600 text-white shadow-lg"
                        : isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 dark:bg-blue-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="dark:bg-gray-900 rounded-2xl p-8">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200/50 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 h-11 px-6 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 px-8 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Create Partner
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 px-8 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
