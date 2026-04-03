"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}
