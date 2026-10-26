import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-[14px] font-medium tracking-[-0.022em] whitespace-nowrap transition-all outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        brand: "bg-[#0071e3] text-white shadow-sm hover:bg-[#0077ed] hover:shadow-md active:bg-[#006edb] ",
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        outline:
          "border-[#d2d2d7] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b]/20 shadow-sm",
        secondary:
          "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]",
        ghost:
          "hover:bg-[#f5f5f7] hover:text-foreground text-muted-foreground",
        destructive:
          "bg-[#ff3b30] text-white hover:bg-[#ff3b30]/90 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 rounded-full px-3 text-xs",
        sm: "h-8 gap-1.5 px-4 text-[13px]",
        lg: "h-11 gap-2 px-7 text-[15px] font-medium",
        icon: "size-9 rounded-full",
        "icon-xs":
          "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
