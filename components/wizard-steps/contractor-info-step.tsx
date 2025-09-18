import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "../building-permit-wizard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ContractorInfoStepProps {
  form: UseFormReturn<FormData>
}

export function ContractorInfoStep({ form }: ContractorInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Contractor information is optional. If you're doing the work yourself or haven't
          selected a contractor yet, you can leave these fields blank.
        </p>
      </div>

      <FormField
        control={form.control}
        name="contractorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contractor Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter contractor's full name or company name" {...field} />
            </FormControl>
            <FormDescription>Leave blank if you're doing the work yourself</FormDescription>
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
              <Input placeholder="Enter contractor's license number" {...field} />
            </FormControl>
            <FormDescription>Required if using a licensed contractor</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
