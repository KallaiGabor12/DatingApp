import PasswordResetPanel from "@/components/auth/PasswordResetPanel";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { useContext, createContext, useState } from "react";

export const metadata: Metadata = {
  title: "Bejelentkezés - COOL-FINISH KFT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignIn() {
  return (
      <SignInForm />
  );

}
