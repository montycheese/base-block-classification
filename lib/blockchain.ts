import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function getLatestBlockWithTransactions() {
  const block = await publicClient.getBlock({
    blockTag: "latest",
    includeTransactions: true,
  });
  return block;
}

export async function getBlockWithTransactions(blockNumber: bigint) {
  const block = await publicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });
  return block;
}

export interface ClassifiedTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  input: string;
  blockNumber: bigint;
  timestamp: number;
}

interface TransactionLike {
  hash: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}` | null;
  value: bigint;
  input: `0x${string}`;
  blockNumber: bigint | null;
}

export function extractTransactionData(
  tx: TransactionLike,
  blockTimestamp: bigint
): ClassifiedTransaction {
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    input: tx.input,
    blockNumber: tx.blockNumber ?? 0n,
    timestamp: Number(blockTimestamp) * 1000,
  };
}
