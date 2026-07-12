"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/customers");
  }, [router]);

  return null;
}
