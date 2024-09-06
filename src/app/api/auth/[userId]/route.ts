import { NextRequest, NextResponse } from "next/server";
import { getCache } from "@/utils/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    let user = getCache(`user_${userId}`);
    return NextResponse.json(user);
  } catch (error) {
    return {
      status: 500,
      body: { message: "Failed to get user data" },
    };
  }
}
