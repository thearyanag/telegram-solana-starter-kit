'use client'
import { useDidMount } from "@/hooks/did-mount"

import { SDKProvider } from "@telegram-apps/sdk-react"

export default function TelegramProvider({ children } : { children: React.ReactNode }) {
  return (
    <SDKProvider acceptCustomStyles debug>{children}</SDKProvider>
  )
}