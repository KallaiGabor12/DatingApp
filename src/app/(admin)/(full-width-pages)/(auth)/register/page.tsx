import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regisztráció - COOL-FINISH KFT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Register() {
  return <RegisterForm />;
}
