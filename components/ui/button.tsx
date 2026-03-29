"use client";

import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";
import { audio } from "@/lib/soundEngine";

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-black border-b-4 border-r-4 border-green-700 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 hover:brightness-110",
            secondary: "bg-secondary text-white border-b-4 border-r-4 border-gray-700 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 hover:brightness-110",
            danger: "bg-accent text-white border-b-4 border-r-4 border-red-800 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 hover:brightness-110",
            ghost: "bg-transparent text-foreground hover:bg-white/10"
        };

        const sizes = {
            sm: "px-3 py-1 text-xs",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base"
        };

            return (
                <motion.button
                    ref={ref}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "font-pixel uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                        variants[variant],
                        sizes[size],
                        className
                    )}
                    onClick={(e) => {
                        audio?.playClick();
                        props.onClick?.(e);
                    }}
                    {...props}
                >
                    {children}
                </motion.button>
            );
        }
    );

Button.displayName = "Button";
