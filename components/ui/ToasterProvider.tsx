"use client";

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: 'font-pixel text-xs bg-secondary text-white border-2 border-primary border-solid !rounded-none',
                style: {
                    background: 'var(--secondary)',
                    color: 'var(--foreground)',
                    border: '2px solid var(--primary)',
                    borderRadius: '0',
                    fontFamily: 'var(--font-press-start), monospace',
                    fontSize: '10px'
                },
                success: {
                    iconTheme: {
                        primary: 'var(--primary)',
                        secondary: 'black',
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--accent)',
                        secondary: 'white',
                    }
                }
            }}
        />
    );
}
