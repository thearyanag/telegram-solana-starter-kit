// File: utils/phantom.ts
import bs58 from "bs58";
import nacl from "tweetnacl";

const dappKeyPair = nacl.box.keyPair.fromSecretKey(
  bs58.decode("6WmwqxUhJ86s97czVsRREiP7m5WeMMQdnRE3e7ecwgUy")
);

const onConnectRedirectLink = `${process.env.NEXT_PUBLIC_URL}/api/callback`;

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

// const signAndSendTransaction = async (session) => {
//   const transaction = await createTransferTransaction();

//   const serializedTransaction = transaction.serialize({
//     requireAllSignatures: false,
//   });

//   const payload = {
//     session,
//     transaction: bs58.encode(serializedTransaction),
//   };
//   const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

//   const params = new URLSearchParams({
//     dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
//     nonce: bs58.encode(nonce),
//     redirect_link: onSignAndSendTransactionRedirectLink,
//     payload: bs58.encode(encryptedPayload),
//   });

//   addLog("Sending transaction...");
//   const url = buildUrl("signAndSendTransaction", params);
//   Linking.openURL(url);
// };
