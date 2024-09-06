import { NextRequest, NextResponse } from "next/server";
import { getCache , getAll } from "@/utils/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    console.log(getAll());
    let user = getCache(`user_${userId}`);
    console.log("user", user);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "user data not found" }, { status: 500 });
  }
}
