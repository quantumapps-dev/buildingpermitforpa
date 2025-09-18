"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

interface FormData {
  applicantName: string
  applicantAddress: string
  phoneNumber: string
  email: string
  taxId: string
  propertyAddress: string
  countyName: string
  projectType: string
  projectDescription: string
  estimatedCost: string
  startDate: string
  contractorName: string
  contractorLicense: string
}

const projectTypes = [
  "New Construction - Residential",
  "New Construction - Commercial",
  "Addition - Residential",
  "Addition - Commercial",
  "Renovation - Residential",
  "Renovation - Commercial",
  "Demolition",
  "Deck/Patio",
  "Fence",
  "Pool",
  "Shed/Accessory Structure",
  "Other",
]

const steps = [
  { id: 1, title: "Applicant Information", description: "Personal and contact details" },
  { id: 2, title: "Property Information", description: "Property and location details" },
  { id: 3, title: "Project Details", description: "Construction project information" },
  { id: 4, title: "Contractor Information", description: "Contractor details (optional)" },
  { id: 5, title: "Review & Submit", description: "Review your application" },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    applicantName: "",
    applicantAddress: "",
    phoneNumber: "",
    email: "",
    taxId: "",
    propertyAddress: "",
    countyName: "",
    projectType: "",
    projectDescription: "",
    estimatedCost: "",
    startDate: "",
    contractorName: "",
    contractorLicense: "",
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
  }

  const progress = (currentStep / steps.length) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Application Submitted Successfully!</CardTitle>
              <CardDescription>
                Your building permit application has been submitted. You will receive a confirmation email shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Building Permit Application</h1>
          <p className="text-lg text-gray-600">Submit your building permit application for Pennsylvania</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${step.id <= currentStep ? "text-blue-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs mt-1 text-center max-w-20">{step.title}</div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Applicant Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Full Name *</Label>
                    <Input
                      id="applicantName"
                      placeholder="Enter your full name"
                      value={formData.applicantName}
                      onChange={(e) => updateFormData("applicantName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID Number *</Label>
                    <Input
                      id="taxId"
                      placeholder="123-45-6789"
                      value={formData.taxId}
                      onChange={(e) => updateFormData("taxId", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="applicantAddress">Mailing Address *</Label>
                    <Input
                      id="applicantAddress"
                      placeholder="123 Main St, City, State, ZIP"
                      value={formData.applicantAddress}
                      onChange={(e) => updateFormData("applicantAddress", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Property Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address *</Label>
                    <Input
                      id="propertyAddress"
                      placeholder="123 Construction Site Ave, City, State, ZIP"
                      value={formData.propertyAddress}
                      onChange={(e) => updateFormData("propertyAddress", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countyName">County Name *</Label>
                    <Input
                      id="countyName"
                      placeholder="e.g., Philadelphia, Allegheny, Montgomery"
                      value={formData.countyName}
                      onChange={(e) => updateFormData("countyName", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Project Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => updateFormData("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="Provide a detailed description of your construction project..."
                      className="min-h-[100px]"
                      value={formData.projectDescription}
                      onChange={(e) => updateFormData("projectDescription", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedCost">Estimated Cost *</Label>
                      <Input
                        id="estimatedCost"
                        type="number"
                        placeholder="0"
                        value={formData.estimatedCost}
                        onChange={(e) => updateFormData("estimatedCost", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Planned Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData("startDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contractor Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Contractor information is optional. If you're doing the work yourself or
                      haven't selected a contractor yet, you can leave these fields blank.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorName">Contractor Name</Label>
                    <Input
                      id="contractorName"
                      placeholder="Enter contractor's full name or company name"
                      value={formData.contractorName}
                      onChange={(e) => updateFormData("contractorName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorLicense">Contractor License Number</Label>
                    <Input
                      id="contractorLicense"
                      placeholder="Enter contractor's license number"
                      value={formData.contractorLicense}
                      onChange={(e) => updateFormData("contractorLicense", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Please review your information carefully before submitting.</strong> Once submitted,
                      changes may require additional processing time.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Applicant Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium">Name:</span> {formData.applicantName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {formData.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {formData.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">Tax ID:</span> {formData.taxId}
                        </div>
                        <div>
                          <span className="font-medium">Address:</span> {formData.applicantAddress}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Property Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium">Property Address:</span> {formData.propertyAddress}
                        </div>
                        <div>
                          <span className="font-medium">County:</span> {formData.countyName}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium">Project Type:</span> {formData.projectType}
                        </div>
                        <div>
                          <span className="font-medium">Estimated Cost:</span> ${formData.estimatedCost}
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span> {formData.startDate}
                        </div>
                        <div>
                          <span className="font-medium">Description:</span>
                          <p className="mt-1 text-sm text-gray-600">{formData.projectDescription}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contractor Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {formData.contractorName ? (
                          <>
                            <div>
                              <span className="font-medium">Contractor Name:</span> {formData.contractorName}
                            </div>
                            {formData.contractorLicense && (
                              <div>
                                <span className="font-medium">License Number:</span> {formData.contractorLicense}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500 italic">No contractor information provided</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
