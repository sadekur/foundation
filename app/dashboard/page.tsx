"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/common/LoadingScreen";
import FoundationDashboard from "@/components/dashboard/FoundationDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace("/salsabilownerlogin");
    }
  }, [checkingAuth, user, router]);

  if (checkingAuth || !user) {
    return <LoadingScreen />;
  }

  return <FoundationDashboard user={user} />;
}
