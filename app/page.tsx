import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Chat</h1>
        <Chat />
      </div>
    </main>
  );
}
