"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export function FailedAuth() {
  const handleRetry = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-red-700">
            Authentication Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            We couldn&apos;t link your Phantom wallet to your Telegram account.
            Please try again.
          </p>
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-800 font-medium">
              Make sure you have a Phantom wallet set up and you&apos;re
              approving the connection request.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
