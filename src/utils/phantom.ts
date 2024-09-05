// File: utils/phantom.ts
import bs58 from "bs58";
import nacl from "tweetnacl";

const dappKeyPair = nacl.box.keyPair.fromSecretKey(
  bs58.decode("6WmwqxUhJ86s97czVsRREiP7m5WeMMQdnRE3e7ecwgUy")
);

const onConnectRedirectLink = `${process.env.NEXT_PUBLIC_URL}/callback`;

const buildUrl = (path: string, params: URLSearchParams) =>
  `https://phantom.app/ul/v1/${path}?${params.toString()}`;

const decryptPayload = (
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

export const connect = () => {
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    cluster: "mainnet-beta",
    app_url: `${process.env.NEXT_PUBLIC_URL}`,
    redirect_link: onConnectRedirectLink,
  });

  const url = buildUrl("connect", params);

  return url;
};

export async function handlePhantomCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("URL Params:", urlParams.toString());
  const phantomEncryptionPublicKey = urlParams.get("phantom_encryption_public_key");
  const nonce = urlParams.get("nonce");
  const data = urlParams.get("data");

  if (phantomEncryptionPublicKey && nonce && data) {
    try {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(phantomEncryptionPublicKey),
        dappKeyPair.secretKey
      );
      const decryptedData = decryptPayload(data, nonce, sharedSecretDapp);
      localStorage.setItem("phantomSession", decryptedData.session);
      localStorage.setItem("phantomPublicKey", decryptedData.public_key);
      console.log("Authentication successful");
      return true;
    } catch (error) {
      console.error("Decryption failed:", error);
      return false;
    }
  } else {
    console.error("Authentication failed: Missing parameters");
    return false;
  }
}
