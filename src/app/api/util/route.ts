import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { NextRequest } from 'next/server'

const dappKeyPair = nacl.box.keyPair();

// console.log("Dapp Public Key:", bs58.encode(dappKeyPair.publicKey));
// B5hhP71VzKBYwf4Z6zSYiCnxrSNX3YPYRVhF96zJESEE
export async function GET(req: NextRequest) {


const dappKeyPair = nacl.box.keyPair.fromSecretKey(
  bs58.decode("6WmwqxUhJ86s97czVsRREiP7m5WeMMQdnRE3e7ecwgUy")
);

console.log(dappKeyPair.publicKey)

  return req.json();
}