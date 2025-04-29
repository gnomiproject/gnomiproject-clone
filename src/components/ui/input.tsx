
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, autoFocus, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Handle autoFocus safely without using the autoFocus prop
    React.useEffect(() => {
      // Only attempt to focus if explicitly requested via prop
      if (autoFocus && inputRef.current) {
        // Use a more significant delay to avoid race conditions with other elements
        const timer = setTimeout(() => {
          try {
            // Check if document is visible and able to receive focus
            if (document.visibilityState === 'visible' && 
                (!document.activeElement || document.activeElement === document.body)) {
              console.log('Input attempting to focus safely');
              inputRef.current?.focus({ preventScroll: true });
            } else {
              console.log('Input skipping focus - document has active element already');
            }
          } catch (e) {
            console.warn('Focus attempt failed:', e);
          }
        }, 300);
        
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
