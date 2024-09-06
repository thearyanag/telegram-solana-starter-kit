'use client'

import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingPage() {
  const openTelegramApp = () => {
    // Replace 'your_bot_username' with your actual Telegram bot username
    window.open('https://t.me/phantom_wallet_test_bot', )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Telegram Phantom Auth</CardTitle>
          <CardDescription>Seamless Authentication for Telegram Mini Apps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logo.webp"
              alt="Telegram Mini App Logo"
              width={150}
              height={150}
              className="rounded-full shadow-lg"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Why Choose Our Mini App?</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Secure 1 Time Phantom Wallet Integration</li>
              <li>✅ Seamless User Experience</li>
              <li>✅ Fast and Responsive</li>
              <li>✅ Direct Telegram User Authentication</li>
            </ul>
          </div>

          <Button 
            onClick={openTelegramApp} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Open in Telegram
          </Button>

          <p className="text-xs text-center text-gray-500">
            Compatible with Telegram on iOS, Android
          </p>
        </CardContent>
      </Card>
    </div>
  )
}