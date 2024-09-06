"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SuccessfulAuth() {
  const handleContinue = () => {
    window.location.href = "/wallet";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-green-700">
            Authentication Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Your Phantom wallet has been successfully linked to your Telegram
            account.
          </p>
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-800 font-medium">
              You can now use Phantom wallet features within this Telegram Mini
              App!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleContinue}
          >
            Continue to App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
