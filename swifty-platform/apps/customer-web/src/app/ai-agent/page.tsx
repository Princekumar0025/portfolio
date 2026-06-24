import { AIChatbot } from '../../components/AIChatbot';
import { HeroSearch } from '../../components/HeroSearch';

export default function AIAgentPage() {
  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-full">
        <h1 className="text-center font-black text-3xl mb-8 text-zinc-900 dark:text-zinc-100">Talk to Swifty</h1>
        <AIChatbot />
      </div>
    </main>
  );
}
