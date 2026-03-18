import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/**
 * Site-wide content container.
 * Provides: width 100%, max-width 1636px, horizontally centered.
 * Pass additional class names (e.g. padding, margin) via `className`.
 */
const Container = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => (
  <div className={cn("w-full max-w-[1636px] mx-auto", className)} {...props}>
    {children}
  </div>
);

export default Container;
