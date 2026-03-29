"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!auth) {
            toast.error("Firebase is not configured! Check .env.local file.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account created successfully! Welcome to PixelQuest.");
            router.push("/dashboard");
        } catch (error: unknown) {
            console.error("Register Error:", error);
            const e = error as Error;
            toast.error(e.message || "Failed to create account.");
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
                        <h1 className="text-3xl text-primary font-pixel drop-shadow-md">REGISTER</h1>
                        <p className="text-xs text-gray-400">CREATE A NEW PLAYER ACCOUNT</p>
                    </div>

                    <form onSubmit={handleRegister} className="w-full space-y-4">
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
                        <Input
                            type="password"
                            placeholder="CONFIRM_PASSWORD"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="pt-4 flex flex-col gap-2">
                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full text-lg py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? "CREATING..." : "JOIN QUEST"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-sm py-2 border-2 border-gray-600"
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
                        <span className="text-gray-400">ALREADY PLAYING?</span>{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            LOGIN HERE
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
