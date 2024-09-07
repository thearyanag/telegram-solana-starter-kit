import { NextRequest, NextResponse } from "next/server";
import { decryptPayload } from "@/utils/phantom";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { setCache } from "@/utils/cache";

// it's recommended to have unique key pairs for each user
const dappKeyPair = nacl.box.keyPair.fromSecretKey(
  bs58.decode(process.env.DAPP_PRIVATE_KEY as string)
);

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const query = req.nextUrl.searchParams;
  const userId = params.userId;

  const nonce = query.get("nonce");
  const data = query.get("data");
  const phantom_encryption_public_key = query.get(
    "phantom_encryption_public_key"
  );

  if (!nonce || !data || !phantom_encryption_public_key) {
    return NextResponse.redirect(
      `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_BOT_APP_NAME}?startapp=failure`
    );
  }

  try {
    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantom_encryption_public_key),
      dappKeyPair.secretKey
    );
    const decryptedData = decryptPayload(data, nonce, sharedSecretDapp);
    setCache(`user_${userId}`, {
      session: decryptedData.session,
      public_key: decryptedData.public_key,
      phantom_encryption_public_key,
      shared_secret: bs58.encode(sharedSecretDapp),
    });
    return NextResponse.redirect(
      `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_BOT_APP_NAME}?startapp=success`
    );
  } catch (error) {
    console.error("Decryption failed:", error);
    return NextResponse.redirect(
      `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_BOT_APP_NAME}?startapp=failure`
    );
  }
}
