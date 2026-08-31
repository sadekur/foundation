"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";

export default function SalsabilOwnerLoginPage() {
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
    if (!checkingAuth && user) {
      router.replace("/dashboard");
    }
  }, [checkingAuth, user, router]);

  if (checkingAuth || user) {
    return <LoadingScreen />;
  }

  return <LoginScreen />;
}
