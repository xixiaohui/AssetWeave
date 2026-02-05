import CryptoJS from "crypto-js";

const SECRET = process.env.WALLET_ENCRYPT_SECRET!;

export function encryptPrivateKey(privateKey: string) {
  return CryptoJS.AES.encrypt(privateKey, SECRET).toString();
}

export function decryptPrivateKey(cipher: string) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
