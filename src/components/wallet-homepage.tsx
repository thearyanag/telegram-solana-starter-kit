"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRightIcon, LogOutIcon, SendIcon } from "lucide-react";
import { Transaction, WalletData } from "@/types";
import { useUser } from "@/context/user-context";
import { signAndSendTransaction } from "@/utils/phantom";

export function WalletHomepage(): JSX.Element {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, loading: userLoading, logout, setAuthStatus } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      setWalletAddress(user.public_key);
    }
  }, [userLoading, user]);

  const fetchWalletData = async (): Promise<void> => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet?address=${walletAddress}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: WalletData = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [walletAddress]);

  const handleDisconnect = (): void => {
    setWalletAddress("");
    setBalance(0);
    setTransactions([]);
    setAuthStatus("");
    logout();
    window.location.href = "/";
  };

  const handleSendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let recipient = (e.currentTarget[0] as HTMLInputElement).value;
    let amount = parseFloat((e.currentTarget[1] as HTMLInputElement).value);

    if (!user?.session || !user?.shared_secret || !user?.public_key) {
      console.error("User session, shared secret or public key is missing");
      return;
    }

    let url = await signAndSendTransaction(
      user?.session,
      user?.shared_secret,
      user?.public_key,
      recipient,
      amount
    );

    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleDisconnect}>
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <form onSubmit={handleSendMoney} className="space-y-4 mb-6">
            <Input type="text" placeholder="Recipient address" />
            <Input type="number" placeholder="Amount" step="0.001" min="0" />
            <Button type="submit" className="w-full">
              <SendIcon className="mr-2 h-4 w-4" /> Send Money
            </Button>
          </form>
          <div>
            <h3 className="font-semibold mb-2">Transaction History</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ScrollArea className="h-[200px]">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <ArrowRightIcon
                        className={`h-4 w-4 mr-2 ${
                          tx.type === "Received"
                            ? "text-green-500 rotate-180"
                            : "text-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {tx.type === "Received"
                            ? `From ${tx.from}`
                            : `To ${tx.to}`}
                        </p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <p
                      className={`font-medium ${
                        tx.type === "Received"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {tx.type === "Received" ? "+" : "-"}$
                      {tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
