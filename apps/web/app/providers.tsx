"use client";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <Toaster />
      {children}
    </RecoilRoot>
  );
};
