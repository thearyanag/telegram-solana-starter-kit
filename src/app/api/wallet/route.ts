import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";
import { WalletData, Transaction } from "@/types";

export async function GET(
  req: NextRequest
): Promise<NextResponse<WalletData | { error: string }>> {
  const searchParams = req.nextUrl.searchParams;
  const walletAddress = searchParams.get("address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  const connection = new Connection(process.env.RPC_URL as string);

  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 10,
    });

    const transactions: Transaction[] = await Promise.all(
      signatures.map(async (sig): Promise<Transaction> => {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        const txDetails = tx as ParsedTransactionWithMeta;

        const preBalance = txDetails.meta?.preBalances[0] || 0;
        const postBalance = txDetails.meta?.postBalances[0] || 0;
        const amount = Math.abs(postBalance - preBalance) / 1e9;

        return {
          id: sig.signature,
          type: postBalance > preBalance ? "Received" : "Sent",
          amount,
          from: txDetails.transaction.message.accountKeys[0]?.pubkey.toString(),
          to: txDetails.transaction.message.accountKeys[1]?.pubkey.toString(),
          date: new Date(sig.blockTime ? sig.blockTime * 1000 : Date.now())
            .toISOString()
            .split("T")[0],
        };
      })
    );

    const walletData: WalletData = {
      balance: balance / 1e9,
      transactions,
    };

    return NextResponse.json(walletData);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
