import { eq } from "drizzle-orm";
import { db } from "../../db";
import { unitsTable } from "../../db/schema";

export async function getUnitById(unitId: number) {
  try {
    const unit = db.select().from(unitsTable).where(eq(unitsTable.id, unitId));

    if (!unit) {
      return { message: "error" };
    }

    return { message: "success", data: unit };
  } catch (error) {
    return { message: "error" };
  }
}
