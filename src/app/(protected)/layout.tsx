"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { logout } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <AuthGuard>
      <Navbar isLanding={false} onLogout={handleLogout} />
      <div className="pt-32 pb-12 px-4 max-w-[1600px] mx-auto">
        {children}
      </div>
    </AuthGuard>
  );
}
