"use client";

import { memo } from "react";
import type { ClassifiedTransaction } from "@/lib/blockchain";
import { classifyTransaction, TX_TYPE_EMOJI, TX_TYPE_LABEL, type TxType } from "@/lib/classifier";
import { truncateAddress, formatRelativeTime, formatEth } from "@/lib/utils";

interface TransactionRowProps {
  tx: ClassifiedTransaction;
  isNew?: boolean;
}

function TransactionRow({ tx, isNew }: TransactionRowProps) {
  const txType: TxType = classifyTransaction({
    to: tx.to,
    input: tx.input,
  } as any);

  const emoji = TX_TYPE_EMOJI[txType];
  const label = TX_TYPE_LABEL[txType];

  return (
    <div
      className={`px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${
        isNew ? "animate-slide-in" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">{emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-zinc-100">{label}</span>
              <span className="text-zinc-400 text-sm font-mono truncate">
                {truncateAddress(tx.from)}
                {tx.to && (
                  <>
                    <span className="text-zinc-500 mx-1">→</span>
                    {truncateAddress(tx.to)}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-zinc-500 text-sm">{formatEth(tx.value)}</span>
            </div>
          </div>
        </div>
        <div className="text-zinc-500 text-sm flex-shrink-0 text-right">
          {formatRelativeTime(tx.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default memo(TransactionRow);
