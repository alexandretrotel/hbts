import { db } from "@/lib/db";
import { badHabits as badHabitsTable } from "@hbts/db/schema";

export async function GET() {
  const badHabits = await db.select().from(badHabitsTable).execute();
}
