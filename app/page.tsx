import LiveFeed from "@/components/LiveFeed";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <LiveFeed />
      </div>
    </main>
  );
}
