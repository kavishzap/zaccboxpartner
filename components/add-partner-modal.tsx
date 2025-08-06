"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Trash2,
  Upload,
  Info,
  Building2,
  User,
  Users,
  Crown,
  FileText,
  Globe,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Briefcase,
  Hash,
  Percent,
  Flag,
  Home,
  BadgeIcon as IdCard,
} from "lucide-react"

interface AddPartnerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Director {
  id: string
  fullName: string
  position: string
  email: string
  phone: string
  idType: string
  idNumber: string
  dateOfBirth: string
  nationality: string
  address: string
}

interface UBO {
  id: string
  fullName: string
  position: string
  email: string
  phone: string
  ownershipPercentage: string
  idType: string
  idNumber: string
  dateOfBirth: string
  nationality: string
  address: string
}

const stepTitles = [
  { title: "Company Info", icon: Building2 },
  { title: "Admin Contact", icon: User },
  { title: "Directors", icon: Users },
  { title: "UBOs", icon: Crown },
  { title: "Documents", icon: FileText },
]

export function AddPartnerModal({ isOpen, onClose }: AddPartnerModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [directors, setDirectors] = useState<Director[]>([])
  const [ubos, setUbos] = useState<UBO[]>([])

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

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
    }
    setDirectors([...directors, newDirector])
  }

  const removeDirector = (id: string) => {
    setDirectors(directors.filter((director) => director.id !== id))
  }

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
    }
    setUbos([...ubos, newUBO])
  }

  const removeUBO = (id: string) => {
    setUbos(ubos.filter((ubo) => ubo.id !== id))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Partner created successfully")
    onClose()
    setCurrentStep(1)
    setDirectors([])
    setUbos([])
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Company Name *
                </Label>
                <Input id="companyName" placeholder="Enter company name" className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortForm" className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-blue-500" />
                  Company Short Form
                </Label>
                <Input id="shortForm" placeholder="e.g., ABC Corp" className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessId" className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Business ID *
                </Label>
                <Input id="businessId" placeholder="Enter business ID" className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-sm font-medium">
                  <Flag className="h-4 w-4 text-blue-500" />
                  Country *
                </Label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    <SelectItem value="au">🇦🇺 Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-blue-500" />
                Website
              </Label>
              <Input id="website" placeholder="https://www.company.com" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                <Home className="h-4 w-4 text-blue-500" />
                Address *
              </Label>
              <Textarea id="address" placeholder="Enter full address" className="min-h-[100px]" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  City *
                </Label>
                <Input id="city" placeholder="Enter city" className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postCode" className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-blue-500" />
                  Post Code *
                </Label>
                <Input id="postCode" placeholder="Enter post code" className="h-11" required />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-green-500" />
                  First Name *
                </Label>
                <Input id="firstName" placeholder="Enter first name" className="h-11" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-green-500" />
                  Last Name *
                </Label>
                <Input id="lastName" placeholder="Enter last name" className="h-11" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-green-500" />
                Admin Email *
              </Label>
              <Input id="adminEmail" type="email" placeholder="admin@company.com" className="h-11" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-green-500" />
                  Phone Number
                </Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-green-500" />
                  Password *
                </Label>
                <Input id="password" type="password" placeholder="Enter secure password" className="h-11" required />
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-2">Important Information:</p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        This person will be the primary administrator for the partner account
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        The email will be used for system notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        Password must be secure and contain at least 8 characters
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

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
                  <p className="text-gray-500 dark:text-gray-300 font-medium">No directors added yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">Click "Add Director" to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {directors.map((director, index) => (
                  <Card
                    key={director.id}
                    className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-sm">Director {index + 1}</CardTitle>
                        </div>
                        <Button
                          onClick={() => removeDirector(director.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Full Name *
                          </Label>
                          <Input placeholder="Enter full name" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            Position
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ceo">CEO</SelectItem>
                              <SelectItem value="cto">CTO</SelectItem>
                              <SelectItem value="director">Director</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email *
                          </Label>
                          <Input type="email" placeholder="director@company.com" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone
                          </Label>
                          <Input placeholder="+1 (555) 123-4567" className="h-9" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <IdCard className="h-3 w-3" />
                            ID Type
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="license">Driver's License</SelectItem>
                              <SelectItem value="national">National ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            ID Number
                          </Label>
                          <Input placeholder="Enter ID number" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Date of Birth
                          </Label>
                          <Input type="date" className="h-9" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            Nationality
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">American</SelectItem>
                              <SelectItem value="uk">British</SelectItem>
                              <SelectItem value="ca">Canadian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Residential Address *
                          </Label>
                          <Input placeholder="Enter address" className="h-9" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Ultimate Beneficial Owners (UBOs)</h3>
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
                  <p className="text-gray-500 dark:text-gray-300 font-medium">No beneficial owners added yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">Add First UBO to continue</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ubos.map((ubo, index) => (
                  <Card
                    key={ubo.id}
                    className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 dark:bg-amber-600 rounded-lg flex items-center justify-center">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-sm">UBO {index + 1}</CardTitle>
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
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Full Name *
                          </Label>
                          <Input placeholder="Enter full name" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            Position
                          </Label>
                          <Input placeholder="Enter position" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            Ownership %
                          </Label>
                          <Input placeholder="25%" className="h-9" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email *
                          </Label>
                          <Input type="email" placeholder="ubo@company.com" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone
                          </Label>
                          <Input placeholder="+1 (555) 123-4567" className="h-9" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <IdCard className="h-3 w-3" />
                            ID Type
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="license">Driver's License</SelectItem>
                              <SelectItem value="national">National ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            ID Number
                          </Label>
                          <Input placeholder="Enter ID number" className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Date of Birth
                          </Label>
                          <Input type="date" className="h-9" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            Nationality
                          </Label>
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">American</SelectItem>
                              <SelectItem value="uk">British</SelectItem>
                              <SelectItem value="ca">Canadian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Residential Address *
                          </Label>
                          <Input placeholder="Enter address" className="h-9" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold">Required Documents</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  Certificate of Incorporation *
                </Label>
                <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:bg-indigo-900/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-indigo-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-200 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Home className="h-4 w-4 text-green-500" />
                  Proof of Address *
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Utility bill, bank statement, or lease agreement
                </p>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:bg-green-900/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-purple-500" />
                  Business Registration Document *
                </Label>
                <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:bg-purple-900/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-sm text-amber-800 dark:text-amber-200">
                    Document Upload Guidelines
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-amber-700 dark:text-amber-200 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-amber-600" />
                      <strong>Accepted Formats:</strong> PDF, DOC, DOCX, JPEG, PNG
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-amber-600" />
                      <strong>Max size:</strong> 10MB per file
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-amber-600" />
                      <strong>Quality:</strong> Ensure documents are clear and readable
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-amber-600" />
                      <strong>Security:</strong> Files are encrypted and GDPR compliant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white/95 dark:bg-gray-900 backdrop-blur-sm border-white/20 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200/50 dark:border-gray-800 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                  Add New Partner
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">Enter comprehensive partner information</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-blue-600 dark:text-blue-300">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber === currentStep
              const isCompleted = stepNumber < currentStep
              const IconComponent = step.icon

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
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center font-medium transition-colors ${
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[500px] bg-white/70 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700">
            {renderStep()}
          </div>

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
              <Button variant="outline" onClick={onClose} className="h-11 px-6 bg-transparent">
                Cancel
              </Button>
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
      </DialogContent>
    </Dialog>
  )
}
