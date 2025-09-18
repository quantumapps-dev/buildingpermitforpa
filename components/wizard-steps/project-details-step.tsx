"use client"

import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "../building-permit-wizard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectDetailsStepProps {
  form: UseFormReturn<FormData>
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

export function ProjectDetailsStep({ form }: ProjectDetailsStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                placeholder="Provide a detailed description of your construction project..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="estimatedCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Cost *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planned Start Date *</FormLabel>
              <FormControl>
                <Input type="date" value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
