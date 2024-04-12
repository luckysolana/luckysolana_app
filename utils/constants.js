import { PublicKey } from "@solana/web3.js";

export const MASTER_SEED = "master";
export const LOTTERY_SEED = "lottery";
export const TICKET_SEED = "ticket";

//Raffle_contract_v4 with TAX

//MAINNET ADDRESS EJzscwPan4ddewfGLZ2uvHxRxfprLyiJZVSiLztNtnbP
export const PROGRAM_ID = new PublicKey(
  "EJzscwPan4ddewfGLZ2uvHxRxfprLyiJZVSiLztNtnbP"
);

// set tikcet price in lamports, below is 0.1 SOL
export const TICKET_PRICE = 100000000;

// LuckySolana admin key
export const ADMIN_PUBLIC_KEY1 = "FwzsLMaNpkQg684TsAbtCUDbnqcBoDAR4fG341YYvyvG";

// Supportting Dev key
export const ADMIN_PUBLIC_KEY2 = "8v3rYRC8UPQkstisANg6VDB64XVwzba8g5TJoMjrQ5eo";


