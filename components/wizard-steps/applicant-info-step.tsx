import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "../building-permit-wizard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ApplicantInfoStepProps {
  form: UseFormReturn<FormData>
}

export function ApplicantInfoStep({ form }: ApplicantInfoStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="applicantName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="your.email@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="(555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="taxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax ID Number *</FormLabel>
            <FormControl>
              <Input placeholder="123-45-6789" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="applicantAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mailing Address *</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, State, ZIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
