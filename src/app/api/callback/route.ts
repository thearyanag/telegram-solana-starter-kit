import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  return { status: 200, body: { message: "Hello World" } };
}
