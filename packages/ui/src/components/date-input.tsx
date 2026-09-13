import * as React from "react"
import { CalendarDays } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@operio/ui/lib/utils";

function DateInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Input
        type="date"
        className={cn(
          "pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:size-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
          className,
        )}
        {...props}
      />
      <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-text-muted" />
    </div>
  )
}

export { DateInput }
