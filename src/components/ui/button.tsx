import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF3B6B] text-white border-2 border-[#0D0D0D] shadow-sticker hover:bg-[#FFD400] hover:text-[#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        secondary:
          "bg-white text-[#111111] border-2 border-[#0D0D0D] shadow-sticker hover:bg-[#F7F7F7] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        outline:
          "bg-white text-[#111111] border border-[#E5E7EB] hover:bg-[#F7F7F7] hover:border-[#0D0D0D]",
        ghost:
          "bg-transparent text-[#9A9A9A] hover:bg-[#F7F7F7] hover:text-[#111111]",
        link: "bg-transparent text-[#9A9A9A] hover:text-[#111111] underline-offset-4 hover:underline p-0 h-auto",
        destructive:
          "bg-[#FF3B6B] text-white border-2 border-[#0D0D0D] shadow-sticker hover:bg-[#F0004A] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        yellow:
          "bg-[#FFD400] text-[#111111] border-2 border-[#0D0D0D] shadow-sticker hover:bg-[#FF3B6B] hover:text-white active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
      },
      size: {
        default: "h-12 px-5 py-2 rounded-button text-sm",
        sm: "h-9 px-4 rounded-button text-xs",
        lg: "h-14 px-8 rounded-button text-base",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
