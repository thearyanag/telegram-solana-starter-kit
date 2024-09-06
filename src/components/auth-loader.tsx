'use client'

import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">Checking Authentication</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 text-center">
            Please wait while we verify your authentication status...
          </p>
          <div className="mt-6 w-full bg-blue-100 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}