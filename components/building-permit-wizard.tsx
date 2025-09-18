"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Form } from "@/components/ui/form"
import { ApplicantInfoStep } from "./wizard-steps/applicant-info-step"
import { PropertyInfoStep } from "./wizard-steps/property-info-step"
import { ProjectDetailsStep } from "./wizard-steps/project-details-step"
import { ContractorInfoStep } from "./wizard-steps/contractor-info-step"
import { ApplicationSummary } from "./application-summary"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

const formSchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantAddress: z.string().min(10, "Please provide a complete address"),
  phoneNumber: z.string().regex(/^[\d\s\-$$$$]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  taxId: z.string().min(9, "Please enter a valid tax ID"),
  propertyAddress: z.string().min(10, "Please provide a complete property address"),
  countyName: z.string().min(2, "Please enter a valid PA county name"),
  projectType: z.string().min(1, "Please select a project type"),
  projectDescription: z.string().min(10, "Description must be at least 10 characters"),
  estimatedCost: z.number().min(1, "Cost must be greater than 0"),
  startDate: z.string().min(1, "Please select a start date"),
  contractorName: z.string().optional(),
  contractorLicense: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

const steps = [
  { id: 1, title: "Applicant Information", description: "Personal and contact details" },
  { id: 2, title: "Property Information", description: "Property and location details" },
  { id: 3, title: "Project Details", description: "Construction project information" },
  { id: 4, title: "Contractor Information", description: "Contractor details (optional)" },
  { id: 5, title: "Review & Submit", description: "Review your application" },
]

export function BuildingPermitWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      applicantAddress: "",
      phoneNumber: "",
      email: "",
      taxId: "",
      propertyAddress: "",
      countyName: "",
      projectType: "",
      projectDescription: "",
      estimatedCost: 0,
      startDate: "",
      contractorName: "",
      contractorLicense: "",
    },
  })

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["applicantName", "applicantAddress", "phoneNumber", "email", "taxId"]
      case 2:
        return ["propertyAddress", "countyName"]
      case 3:
        return ["projectType", "projectDescription", "estimatedCost", "startDate"]
      case 4:
        return ["contractorName", "contractorLicense"]
      default:
        return []
    }
  }

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    setIsSubmitted(true)
  }

  const progress = (currentStep / steps.length) * 100

  if (isSubmitted) {
    return (
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
    )
  }

  return (
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && <ApplicantInfoStep form={form} />}
              {currentStep === 2 && <PropertyInfoStep form={form} />}
              {currentStep === 3 && <ProjectDetailsStep form={form} />}
              {currentStep === 4 && <ContractorInfoStep form={form} />}
              {currentStep === 5 && <ApplicationSummary form={form} />}
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
              <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
