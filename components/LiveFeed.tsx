"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Header";
import TransactionRow from "./TransactionRow";
import {
  getLatestBlockWithTransactions,
  getBlockWithTransactions,
  extractTransactionData,
  type ClassifiedTransaction,
} from "@/lib/blockchain";

const MAX_TRANSACTIONS = 50;
const POLL_INTERVAL = 2000;
const MAX_BACKOFF_DELAY = 10000;

export default function LiveFeed() {
  const [transactions, setTransactions] = useState<ClassifiedTransaction[]>([]);
  const [currentBlockNumber, setCurrentBlockNumber] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [blocksProcessed, setBlocksProcessed] = useState(0);

  const processedBlocksRef = useRef<Set<string>>(new Set());
  const newTxHashesRef = useRef<Set<string>>(new Set());
  const lastProcessedBlockRef = useRef<bigint | null>(null);
  const backoffDelayRef = useRef(POLL_INTERVAL);
  const mountedRef = useRef(true);

  const fetchLatestBlock = useCallback(async () => {
    try {
      const block = await getLatestBlockWithTransactions();
      const blockNumber = block.number;

      if (blockNumber === null) {
        return;
      }

      const blockKey = blockNumber.toString();

      if (processedBlocksRef.current.has(blockKey)) {
        return;
      }

      processedBlocksRef.current.add(blockKey);
      setCurrentBlockNumber(blockNumber);
      setBlocksProcessed((prev) => prev + 1);

      const newTxs = block.transactions.map((tx) =>
        extractTransactionData(tx, block.timestamp)
      );

      newTxs.forEach((tx) => {
        newTxHashesRef.current.add(tx.hash);
        setTimeout(() => {
          newTxHashesRef.current.delete(tx.hash);
        }, 500);
      });

      setTransactions((prev) => {
        const combined = [...newTxs, ...prev];
        return combined.slice(0, MAX_TRANSACTIONS);
      });

      lastProcessedBlockRef.current = blockNumber;
      backoffDelayRef.current = POLL_INTERVAL;
      setError(null);
      setIsReconnecting(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch block:", err);
      setError("Failed to fetch blockchain data");
      setIsReconnecting(true);
      backoffDelayRef.current = Math.min(
        backoffDelayRef.current * 2,
        MAX_BACKOFF_DELAY
      );
    }
  }, []);

  const fetchMissedBlocks = useCallback(async () => {
    if (!lastProcessedBlockRef.current) return;

    try {
      const latestBlock = await getLatestBlockWithTransactions();
      const latestNumber = latestBlock.number;
      const lastProcessed = lastProcessedBlockRef.current;

      if (latestNumber === null || latestNumber <= lastProcessed) return;

      const blocksToFetch: bigint[] = [];
      for (
        let i = lastProcessed + 1n;
        i <= latestNumber && blocksToFetch.length < 5;
        i++
      ) {
        if (!processedBlocksRef.current.has(i.toString())) {
          blocksToFetch.push(i);
        }
      }

      for (const blockNum of blocksToFetch) {
        if (!mountedRef.current) return;

        const block = await getBlockWithTransactions(blockNum);
        const blockNumber = block.number;

        if (blockNumber === null) continue;

        const blockKey = blockNumber.toString();

        if (processedBlocksRef.current.has(blockKey)) continue;

        processedBlocksRef.current.add(blockKey);
        setCurrentBlockNumber(blockNumber);
        setBlocksProcessed((prev) => prev + 1);

        const newTxs = block.transactions.map((tx) =>
          extractTransactionData(tx, block.timestamp)
        );

        newTxs.forEach((tx) => {
          newTxHashesRef.current.add(tx.hash);
          setTimeout(() => {
            newTxHashesRef.current.delete(tx.hash);
          }, 500);
        });

        setTransactions((prev) => {
          const combined = [...newTxs, ...prev];
          return combined.slice(0, MAX_TRANSACTIONS);
        });

        lastProcessedBlockRef.current = blockNumber;
      }

      backoffDelayRef.current = POLL_INTERVAL;
      setError(null);
      setIsReconnecting(false);
    } catch (err) {
      console.error("Failed to fetch missed blocks:", err);
      setIsReconnecting(true);
      backoffDelayRef.current = Math.min(
        backoffDelayRef.current * 2,
        MAX_BACKOFF_DELAY
      );
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    fetchLatestBlock();

    const poll = async () => {
      if (!mountedRef.current) return;

      if (lastProcessedBlockRef.current) {
        await fetchMissedBlocks();
      } else {
        await fetchLatestBlock();
      }

      if (mountedRef.current) {
        setTimeout(poll, backoffDelayRef.current);
      }
    };

    const timeoutId = setTimeout(poll, POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [fetchLatestBlock, fetchMissedBlocks]);

  const uniqueBlocks = new Set(transactions.map((tx) => tx.blockNumber.toString()));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <Header
          blockNumber={currentBlockNumber}
          isConnected={!error && !isLoading}
          isReconnecting={isReconnecting}
        />
      </div>

      {error && !isReconnecting && (
        <div className="px-4 py-3 bg-red-900/20 border-b border-red-800/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="max-h-[600px] overflow-y-auto">
        {isLoading && transactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-zinc-500">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-zinc-500">
            No transactions yet
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionRow
              key={tx.hash}
              tx={tx}
              isNew={newTxHashesRef.current.has(tx.hash)}
            />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-zinc-800 text-zinc-500 text-sm">
        Showing {transactions.length} transactions across {uniqueBlocks.size} block
        {uniqueBlocks.size !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
