"use client";

import { memo } from "react";

interface HeaderProps {
  blockNumber: bigint | null;
  isConnected: boolean;
  isReconnecting: boolean;
}

function Header({ blockNumber, isConnected, isReconnecting }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${
            isReconnecting
              ? "bg-yellow-500 animate-pulse-dot"
              : isConnected
              ? "bg-green-500 animate-pulse-dot"
              : "bg-red-500"
          }`}
        />
        <h1 className="text-xl font-semibold text-zinc-100">Base Live Feed</h1>
        {isReconnecting && (
          <span className="text-sm text-yellow-500 ml-2">Reconnecting...</span>
        )}
      </div>
      <div className="text-zinc-400 text-sm font-mono">
        {blockNumber ? `Block #${blockNumber.toString()}` : "Loading..."}
      </div>
    </div>
  );
}

export default memo(Header);
