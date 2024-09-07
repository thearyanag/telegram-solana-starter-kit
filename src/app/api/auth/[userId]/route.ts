import { NextRequest, NextResponse } from "next/server";
import { getCache, getAll, delCache } from "@/utils/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    let user = getCache(`user_${userId}`);
    delCache(`user_${userId}`);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "user data not found" }, { status: 500 });
  }
}
