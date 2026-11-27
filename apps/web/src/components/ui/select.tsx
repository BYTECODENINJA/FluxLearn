import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

// A shadcn-styled native <select>. Visual chrome (border, ring, chevron) matches
// our <Input>; the underlying element is still a native control so it inherits
// platform a11y, mobile UX, and form semantics without a Radix dependency.
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, multiple, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        multiple={multiple}
        className={cn(
          "border-input bg-background w-full rounded-md border px-3 py-2 shadow-xs transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-base md:text-sm",
          multiple ? "min-h-32" : "flex h-11 appearance-none pr-9 md:h-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {multiple ? null : (
        <ChevronDown
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        />
      )}
    </div>
  )
);
Select.displayName = "Select";

export { Select };
