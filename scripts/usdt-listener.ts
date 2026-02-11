import { ethers } from "ethers";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const USDT = new ethers.Contract(
  process.env.USDT_ADDRESS!,
  [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ],
  provider
);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

USDT.on("Transfer", async (from, to, value, event) => {
  if (to.toLowerCase() !== process.env.TREASURY_ADDRESS!.toLowerCase()) return;

  console.log("USDT Deposit:", from, value.toString());

  await pool.query(
    `INSERT INTO deposits (tx_hash, from_address, amount, confirmed)
     VALUES ($1,$2,$3,true)
     ON CONFLICT (tx_hash) DO NOTHING`,
    [event.log.transactionHash, from, value.toString()]
  );
});

//启动 npx ts-node scripts/usdt-listener.ts