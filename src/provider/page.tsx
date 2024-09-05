'use client'

import { SDKProvider } from "@telegram-apps/sdk-react"

export default function TelegramProvider({ children } : { children: React.ReactNode }) {
  return (
    <SDKProvider>{children}</SDKProvider>
  )
}