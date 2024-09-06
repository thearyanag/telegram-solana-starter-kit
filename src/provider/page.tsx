"use client";
import { UserProvider } from "@/context/user-context";
import { SDKProvider } from "@telegram-apps/sdk-react";

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SDKProvider acceptCustomStyles debug>
      <UserProvider>{children}</UserProvider>
    </SDKProvider>
  );
}
