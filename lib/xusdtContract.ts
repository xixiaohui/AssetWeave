
import XUSDTArtifact from "@/abi/XUSDT.json";

import { getXUSDTAddress } from "./contracts";

import { decryptPrivateKey } from "./wallet-crypto";
import { ethers } from "ethers";

export function getXUSDT() {

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY!;
  const privateKey = decryptPrivateKey(encryptedKey);
  console.log(privateKey);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    privateKey,
    provider
  );

  const contract = new ethers.Contract(
    getXUSDTAddress(),
    XUSDTArtifact.abi,
    wallet
  );

  return contract;
}