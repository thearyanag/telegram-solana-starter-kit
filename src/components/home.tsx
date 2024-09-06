"use client";

import { useEffect, useState } from "react";
import {
  useInitData,
  useLaunchParams,
  useCloudStorage,
} from "@telegram-apps/sdk-react";
import { connect } from "../utils/phantom";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { SuccessfulAuth } from "./successful-auth";
import { FailedAuth } from "./failed-auth";

export function Homepage() {
  const initData = useInitData();
  const launchParams = useLaunchParams();
  const [authStatus, setAuthStatus] = useState("");
  const storage = useCloudStorage();

  const handleAuthenticate = () => {
    if (!initData?.user?.id) return;
    let url = connect(initData?.user?.id);
    window.location.href = url;
  };

  useEffect(() => {
    if (launchParams && launchParams.startParam === "success") {
      setAuthStatus("success");
    }
    if (launchParams && launchParams.startParam === "failure") {
      setAuthStatus("failure");
    }
  }, [launchParams]);

  // useEffect(() => {
  //   if (authStatus === "success") redirect("/wallet");
  // }, [authStatus]);

  return authStatus === "success" ? (
    <SuccessfulAuth />
  ) : authStatus === "failure" ? (
    <FailedAuth />
  ) : (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Telegram Solana Starter Kit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authStatus && (
            <div
              className={`mb-4 text-center ${
                authStatus === "success"
                  ? "text-green-600"
                  : authStatus === "failure"
                  ? "text-destructive"
                  : "text-yellow-600"
              }`}
            >
              {authStatus === "success" && (
                <p>Successfully authenticated with Phantom!</p>
              )}
              {authStatus === "failure" && (
                <p>Authentication failed. Please try again.</p>
              )}
              {authStatus === "error" && (
                <p>
                  An error occurred during authentication. Please try again
                  later.
                </p>
              )}
            </div>
          )}

          {initData && initData.user && (
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={initData.user.photoUrl || "/default-avatar.png"}
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    {initData.user.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Welcome, {initData.user.firstName}!
              </p>
              <p className="text-sm text-gray-600 mb-1">
                @{initData.user.username || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Telegram ID: {initData.user.id}
              </p>
              <p className="text-sm text-gray-600">
                {initData.user.isBot ? "Bot Account" : "User Account"}
              </p>
              <p className="text-sm text-gray-600">hi {initData.startParam}</p>
            </div>
          )}

          {authStatus !== "success" && (
            <Button onClick={handleAuthenticate} className="w-full">
              Authenticate with Phantom
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
