import PasswordResetPanel from "@/components/auth/PasswordResetPanel";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Elfelejtett jelszó - COOL-FINISH KFT.",
    robots: {
        index: false,
        follow: false,
      },
}
export default function ResetPass(){
    return <PasswordResetPanel />;
}