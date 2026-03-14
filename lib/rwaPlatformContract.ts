import { ethers } from "ethers";
import RWAArtifact from "@/abi/RWAPlatform1155.json";

import { getRWAPlatformAddress } from "./contracts";

import { decryptPrivateKey } from "./wallet-crypto";

// 服务器 contract（管理员）
export function getRWAPlatformContract() {

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY!;
  const privateKey = decryptPrivateKey(encryptedKey);
  console.log(privateKey);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    privateKey,
    provider
  );

  const contract = new ethers.Contract(
    getRWAPlatformAddress(),
    RWAArtifact.abi,
    wallet
  );

  return contract;
}

// 只读 contract
export function getPublicRWAContract() {

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  return new ethers.Contract(
    getRWAPlatformAddress(),
    RWAArtifact.abi,
    provider
  );
}

