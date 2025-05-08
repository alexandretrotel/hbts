import { BadHabits } from "@/components/bad-habits";
import { GoodHabits } from "@/components/good-habits";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserProfile } from "@/components/user-profile";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">hbts</h1>
          <ModeToggle />
        </div>

        <div className="space-y-12">
          <UserProfile />
          <GoodHabits />
          <BadHabits />
        </div>
      </main>
    </div>
  );
}
