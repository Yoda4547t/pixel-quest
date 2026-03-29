import React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 bg-black/50 border-4 outline-none font-pixel text-sm text-foreground placeholder:text-gray-500 transition-colors focus:border-primary",
                        error ? "border-accent" : "border-secondary",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-accent font-pixel">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";
