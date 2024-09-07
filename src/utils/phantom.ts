// File: utils/phantom.ts
import bs58 from "bs58";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import nacl from "tweetnacl";

const dappKeyPair = nacl.box.keyPair.fromSecretKey(
  bs58.decode("6WmwqxUhJ86s97czVsRREiP7m5WeMMQdnRE3e7ecwgUy")
);

const onConnectRedirectLink = `${process.env.NEXT_PUBLIC_URL}/api/callback`;
const onSignAndSendTransactionRedirectLink = `${process.env.NEXT_PUBLIC_URL}/api/callback`;

const buildUrl = (path: string, params: URLSearchParams) =>
  `https://phantom.app/ul/v1/${path}?${params.toString()}`;

export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret?: Uint8Array
) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

export const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};

export const connect = (userId: number) => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    cluster: "mainnet-beta",
    app_url: `${process.env.NEXT_PUBLIC_URL}/`,
    redirect_link: `${onConnectRedirectLink}/${userId}`,
  });

  const url = buildUrl("connect", params);

  return url;
};

const createTransferTransaction = async (
  from: string,
  to: string,
  amount: number
) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  transaction.feePayer = new PublicKey(from);
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  return transaction;
};

export const signAndSendTransaction = async (
  session: string,
  sharedSecret: string,
  from: string,
  to: string,
  amount: number
) => {
  const transaction = await createTransferTransaction(from, to, amount);

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });

  const payload = {
    session,
    transaction: bs58.encode(serializedTransaction),
  };
  const [nonce, encryptedPayload] = encryptPayload(
    payload,
    bs58.decode(sharedSecret)
  );

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: `${onSignAndSendTransactionRedirectLink}/${session}`,
    payload: bs58.encode(encryptedPayload),
  });

  const url = buildUrl("signAndSendTransaction", params);

  return url;
};
