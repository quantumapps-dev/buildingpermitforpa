"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowLeft, ArrowRight, FileText, Upload } from "lucide-react"
import { toast } from "sonner"
import { coerceNumberOrFail, isPositiveNumber } from "@/lib/utils"

const buildingPermitSchema = z.object({
  applicantName: z
    .string()
    .min(2, "Applicant name must be at least 2 characters")
    .max(100, "Applicant name must be less than 100 characters"),
  propertyAddress: z
    .string()
    .min(10, "Property address must be at least 10 characters")
    .max(200, "Property address must be less than 200 characters")
    .refine((val) => val.toLowerCase().includes("pa") || val.toLowerCase().includes("pennsylvania"), {
      message: "Address must be in Pennsylvania (PA)",
    }),
  projectType: z.string().min(1, "Please select a project type"),
  projectDescription: z
    .string()
    .min(10, "Project description must be at least 10 characters")
    .max(1000, "Project description must be less than 1000 characters"),
  estimatedCost: z.string().refine((val) => {
    try {
      const num = coerceNumberOrFail(val)
      return isPositiveNumber(num)
    } catch {
      return false
    }
  }, "Estimated cost must be a positive number"),
  contractorLicense: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true
      return /^[A-Za-z0-9]+$/.test(val.trim())
    }, "Contractor license must be alphanumeric if provided"),
})

type BuildingPermitForm = z.infer<typeof buildingPermitSchema>

const PROJECT_TYPES = [
  "New Construction - Residential",
  "New Construction - Commercial",
  "Addition - Residential",
  "Addition - Commercial",
  "Renovation - Interior",
  "Renovation - Exterior",
  "Deck/Patio Construction",
  "Garage Construction",
  "Shed Construction",
  "Pool Installation",
  "Electrical Work",
  "Plumbing Work",
  "HVAC Installation",
  "Roofing Work",
  "Demolition",
  "Other",
]

const FORM_STEPS = [
  { id: 1, title: "Applicant Information", description: "Basic applicant details" },
  { id: 2, title: "Property & Project", description: "Property and project information" },
  { id: 3, title: "Cost & Contractor", description: "Financial and contractor details" },
  { id: 4, title: "Review & Submit", description: "Review your application" },
]

export default function NewApplication() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClient, setIsClient] = useState(false)

  const form = useForm<BuildingPermitForm>({
    resolver: zodResolver(buildingPermitSchema),
    defaultValues: {
      applicantName: "",
      propertyAddress: "",
      projectType: "",
      projectDescription: "",
      estimatedCost: "",
      contractorLicense: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    setIsClient(true)

    // Load saved data from localStorage
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("buildingPermitDraft")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          form.reset(parsedData)
          toast.info("Draft application loaded")
        } catch (error) {
          console.error("Error loading draft:", error)
        }
      }
    }
  }, [form])

  const watchedValues = form.watch()
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem("buildingPermitDraft", JSON.stringify(watchedValues))
    }
  }, [watchedValues, isClient])

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length))
    } else {
      toast.error("Please fix the errors before continuing")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof BuildingPermitForm)[] => {
    switch (step) {
      case 1:
        return ["applicantName"]
      case 2:
        return ["propertyAddress", "projectType", "projectDescription"]
      case 3:
        return ["estimatedCost", "contractorLicense"]
      default:
        return []
    }
  }

  const onSubmit = (data: BuildingPermitForm) => {
    if (!isClient) return

    // Generate application ID
    const applicationId = `PA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Save to localStorage for tracking
    const applicationData = {
      ...data,
      applicationId,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(`application_${applicationId}`, JSON.stringify(applicationData))
      localStorage.removeItem("buildingPermitDraft") // Clear draft
    }

    toast.success(`Application submitted successfully! Your application ID is: ${applicationId}`)

    // Reset form
    form.reset()
    setCurrentStep(1)
  }

  const progress = (currentStep / FORM_STEPS.length) * 100

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Building Permit Application</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading application form...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Building Permit Application - Pennsylvania
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Submit your building permit application for review and approval
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep} of {FORM_STEPS.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-4 mb-8">
            {FORM_STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  step.id === currentStep
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    : step.id < currentStep
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-current opacity-20" />
                )}
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">{FORM_STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {FORM_STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Applicant Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name of Applicant *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full legal name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the full legal name of the person applying for the permit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Property & Project */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="propertyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street, City, PA 12345" {...field} />
                          </FormControl>
                          <FormDescription>
                            Complete address where the construction work will be performed (must be in PA)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the type of construction project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the category that best describes your construction project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of the proposed construction work, including materials, dimensions, and scope..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed description of the proposed work (minimum 10 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Cost & Contractor */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Project Cost *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="25000" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total estimated cost of the project in USD (numbers only, no commas or dollar signs)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contractorLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contractor License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC123456 (optional)" {...field} />
                          </FormControl>
                          <FormDescription>
                            If using a licensed contractor, enter their license number (alphanumeric format)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Required Documents</h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                            After submission, you will need to upload the following documents:
                          </p>
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Building plans and specifications</li>
                            <li>• Site plan showing property boundaries</li>
                            <li>• Structural engineering drawings (if applicable)</li>
                            <li>• Contractor license verification (if applicable)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Review</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Applicant Name:</span>
                          <p className="text-gray-900 dark:text-white">{form.getValues("applicantName")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Property Address:</span>
                          <p className="text-gray-900 dark:text-white">{form.getValues("propertyAddress")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Type:</span>
                          <p className="text-gray-900 dark:text-white">{form.getValues("projectType")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Estimated Cost:</span>
                          <p className="text-gray-900 dark:text-white">
                            ${Number.parseFloat(form.getValues("estimatedCost") || "0").toLocaleString()}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Description:</span>
                          <p className="text-gray-900 dark:text-white mt-1">{form.getValues("projectDescription")}</p>
                        </div>
                        {form.getValues("contractorLicense") && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Contractor License:</span>
                            <p className="text-gray-900 dark:text-white">{form.getValues("contractorLicense")}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Upload className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                            PA Building Code Compliance
                          </h4>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            By submitting this application, you acknowledge that all work must comply with Pennsylvania
                            building codes and regulations. You will receive document upload instructions after
                            submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  {currentStep < FORM_STEPS.length ? (
                    <Button type="button" onClick={nextStep} className="flex items-center space-x-2">
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      disabled={!form.formState.isValid}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Submit Application</span>
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
