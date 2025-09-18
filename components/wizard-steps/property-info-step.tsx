import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "../building-permit-wizard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PropertyInfoStepProps {
  form: UseFormReturn<FormData>
}

export function PropertyInfoStep({ form }: PropertyInfoStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="propertyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Address *</FormLabel>
            <FormControl>
              <Input placeholder="123 Construction Site Ave, City, State, ZIP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="countyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>County Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Philadelphia, Allegheny, Montgomery" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
