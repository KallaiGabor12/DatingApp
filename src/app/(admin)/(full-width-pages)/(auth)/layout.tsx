import GridShape from "@/components/common/GridShape";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-main lg:grid items-end hidden">
            <div className="bg-[url('/images/pages/login/logincover.jpg')] bg-bottom-right [image-rendering:-webkit-optimize-contrast]
          bg-contain bg-no-repeat w-full h-10/12">

            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
