import { db } from "@/lib/db";
import { badHabits as badHabitsTable } from "@hbts/db/schema";

const getBadHabits = async () => {
  const badHabits = await db.select().from(badHabitsTable).execute();
  return badHabits;
};

export type BadHabit = Awaited<ReturnType<typeof getBadHabits>>[number];

export async function GET() {
  try {
    const badHabits = await getBadHabits();
    return Response.json(badHabits, {
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
