"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useInitData,
  useLaunchParams,
  useCloudStorage,
} from "@telegram-apps/sdk-react";
import { connect } from "../utils/phantom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SuccessfulAuth } from "./successful-auth";
import { FailedAuth } from "./failed-auth";
import { AuthLoader } from "./auth-loader";
import { useUser } from "@/context/user-context";

export function Homepage() {
  const initData = useInitData();
  const launchParams = useLaunchParams();
  const storage = useCloudStorage();
  const router = useRouter();
  const { user, setUser, loading, authStatus, setAuthStatus } = useUser();

  const handleAuthenticate = () => {
    if (!initData?.user?.id) return;
    let url = connect(initData?.user?.id);
    window.location.href = url;
  };

  useEffect(() => {
    if (user && !authStatus) {
      router.push("/wallet");
    } else if (
      launchParams &&
      launchParams.startParam === "success" &&
      authStatus !== "success"
    ) {
      if (initData?.user?.id)
        fetch(`/api/auth/${initData.user.id}`).then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              storage.set("user", JSON.stringify(data));
              setAuthStatus("success");
              setUser(data);
            });
          }
        });
    } else if (launchParams && launchParams.startParam === "failure") {
      setAuthStatus("failure");
    }
  }, [launchParams, initData?.user?.id, user, router]);

  if (loading) {
    return <AuthLoader />;
  }

  if (authStatus === "success") {
    return <SuccessfulAuth />;
  }

  if (authStatus === "failure") {
    return <FailedAuth />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Telegram Solana Starter Kit
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            </div>
          )}

          <Button onClick={handleAuthenticate} className="w-full">
            Authenticate with Phantom
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
