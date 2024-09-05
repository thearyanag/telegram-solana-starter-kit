import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { NextRequest } from 'next/server'

const dappKeyPair = nacl.box.keyPair();

// console.log("Dapp Public Key:", bs58.encode(dappKeyPair.publicKey));
// B5hhP71VzKBYwf4Z6zSYiCnxrSNX3YPYRVhF96zJESEE
async function GET(req: NextRequest) {

  return req.json();
}