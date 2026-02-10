import { ethers } from "ethers";
import RWAArtifact from "@/abi/RWAProtocolV2.json";
import { getRWAProtocolAddress } from "./contracts";

import { decryptPrivateKey } from "./wallet-crypto";

export function getRWAProtocolContract() {

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY!;
  const privateKey = decryptPrivateKey(encryptedKey);
  console.log(privateKey);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    privateKey,
    provider
  );

  const contract = new ethers.Contract(
    getRWAProtocolAddress(),
    RWAArtifact.abi,
    wallet
  );

  return contract;
}
