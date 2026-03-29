"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!auth) {
            toast.error("Firebase is not configured! Check .env.local file.");
            return;
        }

        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            useAuthStore.getState().setProfile(null); // Clear any stale guest state before route transition!
            toast.success("Welcome back to PixelQuest!");
            router.push("/dashboard");
        } catch (error: unknown) {
            console.error("Login Error:", error);
            const e = error as Error;
            toast.error(e.message || "Failed to login. Check credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card variant="bordered" className="flex flex-col gap-6 items-center py-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl text-primary font-pixel drop-shadow-md">LOGIN</h1>
                        <p className="text-xs text-gray-400">ENTER YOUR CREDENTIALS TO CONTINUE</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <Input
                            type="email"
                            placeholder="PLAYER_EMAIL@DOMAIN.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="SECRET_PASSWORD_123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="pt-4 flex flex-col gap-2">
                            <Button
                                type="submit"
                                className="w-full text-lg py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? "LOADING..." : "START GAME"}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full text-sm py-2"
                                onClick={() => {
                                    useAuthStore.getState().loginAsGuest();
                                    toast.success("Playing as Guest!");
                                    router.push("/dashboard");
                                }}
                            >
                                PLAY AS GUEST
                            </Button>
                        </div>
                    </form>

                    <div className="text-xs mt-4">
                        <span className="text-gray-400">NEW PLAYER?</span>{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            REGISTER HERE
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
