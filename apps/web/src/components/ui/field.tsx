import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  hint?: string;
  className?: string;
  labelAction?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  labelAction,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p className="text-destructive text-sm" id={`${htmlFor}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}
