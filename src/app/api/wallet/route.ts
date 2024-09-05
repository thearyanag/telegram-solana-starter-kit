import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  // get wallet address from query params
    const walletAddress = req

  return { status: 200, body: { message: "Hello World" } };
}
