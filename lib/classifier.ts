import type { Transaction } from "viem";

export type TxType =
  | "ETH_TRANSFER"
  | "CONTRACT_CREATION"
  | "ERC20_TRANSFER"
  | "ERC20_APPROVE"
  | "NFT_TRANSFER"
  | "SWAP"
  | "CONTRACT_CALL";

const SELECTORS: Record<string, TxType> = {
  "0xa9059cbb": "ERC20_TRANSFER",
  "0x23b872dd": "ERC20_TRANSFER",
  "0x095ea7b3": "ERC20_APPROVE",
  "0x42842e0e": "NFT_TRANSFER",
  "0xb88d4fde": "NFT_TRANSFER",
  "0xf242432a": "NFT_TRANSFER",
  "0x3593564c": "SWAP",
  "0x04e45aaf": "SWAP",
  "0x5ae401dc": "SWAP",
  "0x5f575529": "SWAP",
  "0x12aa3caf": "SWAP",
};

export function classifyTransaction(tx: Transaction): TxType {
  if (tx.to === null) return "CONTRACT_CREATION";
  if (tx.input === "0x") return "ETH_TRANSFER";
  const selector = tx.input.slice(0, 10).toLowerCase();
  return SELECTORS[selector] || "CONTRACT_CALL";
}

export const TX_TYPE_EMOJI: Record<TxType, string> = {
  ETH_TRANSFER: "💸",
  CONTRACT_CREATION: "📝",
  ERC20_TRANSFER: "🪙",
  ERC20_APPROVE: "✅",
  NFT_TRANSFER: "💎",
  SWAP: "🔄",
  CONTRACT_CALL: "⚡",
};

export const TX_TYPE_LABEL: Record<TxType, string> = {
  ETH_TRANSFER: "ETH Transfer",
  CONTRACT_CREATION: "Contract Creation",
  ERC20_TRANSFER: "ERC20 Transfer",
  ERC20_APPROVE: "ERC20 Approve",
  NFT_TRANSFER: "NFT Transfer",
  SWAP: "Swap",
  CONTRACT_CALL: "Contract Call",
};
