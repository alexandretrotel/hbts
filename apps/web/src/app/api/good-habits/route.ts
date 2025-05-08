import { db } from "@/lib/db";
import { goodHabits as goodHabitsTable } from "@hbts/db/schema";

const getGoodHabits = async () => {
  const habits = await db.select().from(goodHabitsTable).execute();
  return habits;
};

export type GoodHabit = Awaited<ReturnType<typeof getGoodHabits>>[number];

export async function GET() {
  try {
    const habits = await getGoodHabits();
    return Response.json(habits, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch bad habits" },
      {
        status: 500,
      },
    );
  }
}
