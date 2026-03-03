"use client"
import { useState } from "react";
import Link from "next/link";
import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetStage({
  isValidToken = false,
  server_error = "",
  token,
  isBanned = false
}: {
  isValidToken: boolean,
  server_error: string | null,
  token: string,
  isBanned?: boolean
}) {

  if (!isValidToken) {
    return (
      <div className="flex flex-col flex-1 w-full bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-gray-900 dark:to-gray-950">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
          <div className="p-8 bg-white shadow-xl dark:bg-gray-900 rounded-2xl text-center">

            <h1 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              {isBanned ? "Too many attempts 💔" : "This link isn’t valid 💌"}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {server_error ||
                (isBanned
                  ? "Please wait a little before trying again."
                  : "This reset link has expired or is no longer valid.")}
            </p>

            <Link
              href="/login"
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              Back to sign in ❤️
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col flex-1 w-full bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl dark:bg-gray-900 rounded-2xl">

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Create a new password 🔐
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Let’s get you back to discovering connections.
            </p>
          </div>

          <PasswordResetForm token={token} />

        </div>
      </div>
    </div>
  );
}