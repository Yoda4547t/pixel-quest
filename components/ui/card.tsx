import { cn } from "@/utils/cn";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "bordered";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-secondary/40 backdrop-blur-sm p-4",
                    variant === "bordered" && "border-4 border-secondary",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
