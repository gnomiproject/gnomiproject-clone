
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, autoFocus, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Handle autoFocus safely with a slight delay to avoid conflicts
    React.useEffect(() => {
      if (autoFocus && inputRef.current) {
        // Small delay to avoid focus conflicts
        const timer = setTimeout(() => {
          // Only focus if there's no active element or if the body has focus
          if (!document.activeElement || document.activeElement === document.body) {
            inputRef.current?.focus();
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }, [autoFocus]);
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={(node) => {
          // Handle both the forwarded ref and our local ref
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          inputRef.current = node;
        }}
        // Remove the autoFocus prop from getting passed to the DOM element
        // We'll handle it manually with our effect above
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
