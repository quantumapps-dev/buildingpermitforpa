import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "./building-permit-wizard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicationSummaryProps {
  form: UseFormReturn<FormData>
}

export function ApplicationSummary({ form }: ApplicationSummaryProps) {
  const formData = form.getValues()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Please review your information carefully before submitting.</strong> Once submitted, changes may
          require additional processing time.
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
              <span className="font-medium">Estimated Cost:</span> {formatCurrency(formData.estimatedCost)}
            </div>
            <div>
              <span className="font-medium">Start Date:</span> {formatDate(formData.startDate)}
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
  )
}
