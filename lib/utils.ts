export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 1) return "just now";
  if (diffSecs < 60) return `${diffSecs} sec${diffSecs === 1 ? "" : "s"} ago`;

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function formatEth(value: bigint): string {
  const ethValue = Number(value) / 1e18;
  if (ethValue === 0) return "0.00 ETH";
  if (ethValue < 0.01) return "<0.01 ETH";
  return `${ethValue.toFixed(2)} ETH`;
}
