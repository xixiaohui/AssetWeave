import { ethers } from "ethers";
import RWAArtifact from "@/abi/RWAAsset.json";
import { getRWAAddress } from "./contracts";

import { decryptPrivateKey } from "./wallet-crypto";

export function getRWAContract() {

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY!;
  const privateKey = decryptPrivateKey(encryptedKey);
  console.log(privateKey);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    privateKey,
    provider
  );

  const contract = new ethers.Contract(
    getRWAAddress(),
    RWAArtifact.abi,
    wallet
  );

  return contract;
}
