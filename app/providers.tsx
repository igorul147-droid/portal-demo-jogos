"use client";

import { ReactNode } from "react";
import { DemoWalletProvider } from "@/components/DemoWalletProvider";
import ModalResponsavel from "@/components/ModalResponsavel";
import ToastContainer from "@/components/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <DemoWalletProvider>
      {children}
      <ModalResponsavel />
      <ToastContainer />
    </DemoWalletProvider>
  );
}