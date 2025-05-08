import { db } from "@/lib/db";
import { goodHabitsLog as goodHabitsLogTable } from "@hbts/db/schema";

const getGoodHabitsLogs = async () => {
  const habitsLogs = await db.select().from(goodHabitsLogTable).execute();
  return habitsLogs;
};

export type GoodHabitLog = Awaited<
  ReturnType<typeof getGoodHabitsLogs>
>[number];

export async function GET() {
  try {
    const habitsLogs = await getGoodHabitsLogs();
    return Response.json(habitsLogs, {
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
