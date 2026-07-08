import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#0D0D0D] bg-[#FFD400] text-[#111111]",
        pink: "border-[#0D0D0D] bg-[#FF3B6B] text-white",
        secondary: "border-[#E5E7EB] bg-[#F7F7F7] text-[#111111]",
        outline: "border-[#E5E7EB] bg-transparent text-[#111111]",
        destructive: "border-transparent bg-[#FF3B6B] text-white",
        success: "border-transparent bg-green-100 text-green-700",
        warning: "border-[#0D0D0D] bg-[#FFD400] text-[#111111]",
        info: "border-transparent bg-blue-100 text-blue-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
