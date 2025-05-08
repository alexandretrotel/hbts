import { BadHabits } from "@/components/bad-habits";
import { GoodHabits } from "@/components/good-habits";
import { UserProfile } from "@/components/user-profile";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">hbts</h1>

        <div className="space-y-8">
          <UserProfile />
          <GoodHabits />
          <BadHabits />
        </div>
      </main>
    </div>
  );
}
