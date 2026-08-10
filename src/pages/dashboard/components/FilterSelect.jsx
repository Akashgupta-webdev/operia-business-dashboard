import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FilterSelect({ label, value, options, onChange, className }) {
  return (
    <Select items={options} value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-9! w-full min-w-0 border-input bg-card text-body-sm font-medium shadow-card hover:border-outline dark:bg-card dark:hover:bg-accent sm:w-auto sm:min-w-32",
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false} className="shadow-overlay">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
