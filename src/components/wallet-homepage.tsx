'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRightIcon, LogOutIcon, SendIcon } from "lucide-react"

export function WalletHomepage() {
  const [balance, setBalance] = useState(1234.56)
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Received", amount: 50, from: "Alice", date: "2023-04-01" },
    { id: 2, type: "Sent", amount: 30, to: "Bob", date: "2023-04-02" },
    { id: 3, type: "Received", amount: 100, from: "Charlie", date: "2023-04-03" },
  ])

  const handleDisconnect = () => {
    // Implement wallet disconnection logic here
    console.log("Wallet disconnected")
  }

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement send money logic here
    console.log("Money sent")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">My Wallet</CardTitle>
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
            <Input type="number" placeholder="Amount" step="0.01" min="0" />
            <Button type="submit" className="w-full">
              <SendIcon className="mr-2 h-4 w-4" /> Send Money
            </Button>
          </form>
          
          <div>
            <h3 className="font-semibold mb-2">Transaction History</h3>
            <ScrollArea className="h-[200px]">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center">
                    <ArrowRightIcon className={`h-4 w-4 mr-2 ${tx.type === "Received" ? "text-green-500 rotate-180" : "text-red-500"}`} />
                    <div>
                      <p className="text-sm font-medium">{tx.type === "Received" ? `From ${tx.from}` : `To ${tx.to}`}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${tx.type === "Received" ? "text-green-500" : "text-red-500"}`}>
                    {tx.type === "Received" ? "+" : "-"}${tx.amount}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}